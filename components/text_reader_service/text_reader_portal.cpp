// Setup-page routes for the books folder: list, upload (plain text only -- the page converts
// EPUB to text in the browser before sending), and delete.
#include "text_reader_portal.h"

#include <algorithm>
#include <cerrno>
#include <cstdio>
#include <cstring>
#include <memory>
#include <string>
#include <sys/stat.h>
#include <unistd.h>

#include "cJSON.h"
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "sdkconfig.h"
#include "storage_service.h"
#include "text_reader_book_filename.h"
#include "text_reader_service.h"

namespace text_reader_service {
namespace {

constexpr const char* kTag = "TextReaderPortal";
constexpr const char* kListUri = "/api/books";
constexpr const char* kUploadUri = "/api/books/upload";
constexpr const char* kDeleteUri = "/api/books/delete";
// A long novel as plain text is 1-3 MB; refuse anything far beyond that so a wrong file
// can't exhaust PSRAM.
constexpr size_t kMaxBookBytes = 6 * 1024 * 1024;
// Leave this much PSRAM for everything else (recording buffers, Wi-Fi, display).
constexpr size_t kPsramReserveBytes = 1024 * 1024;
constexpr size_t kReceiveChunkBytes = 4096;

struct PsramFree {
    void operator()(char* p) const { heap_caps_free(p); }
};

esp_err_t SendJson(httpd_req_t* request, const char* status, cJSON* root)
{
    char* text = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    if (text == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    httpd_resp_set_status(request, status);
    httpd_resp_set_type(request, "application/json");
    httpd_resp_set_hdr(request, "Cache-Control", "no-store");
    const esp_err_t err = httpd_resp_sendstr(request, text);
    cJSON_free(text);
    return err;
}

esp_err_t SendMessage(httpd_req_t* request, const char* status, bool success,
                      const std::string& message)
{
    cJSON* root = cJSON_CreateObject();
    if (root == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    cJSON_AddBoolToObject(root, "success", success);
    cJSON_AddStringToObject(root, "message", message.c_str());
    return SendJson(request, status, root);
}

// Why the card can't be used right now, or empty when it can.
std::string CardUnavailableReason()
{
    if (storage_service::IsUsbModeActive()) {
        return "The SD card is connected to a computer (USB drive mode). Turn that off on the "
               "device first.";
    }
    if (!storage_service::IsMounted()) {
        return "No SD card is available. Check that a card is inserted.";
    }
    return {};
}

std::string QueryValue(httpd_req_t* request, const char* key)
{
    const size_t length = httpd_req_get_url_query_len(request);
    if (length == 0) {
        return {};
    }
    std::string query(length + 1, '\0');
    if (httpd_req_get_url_query_str(request, query.data(), query.size()) != ESP_OK) {
        return {};
    }
    std::string value(length + 1, '\0');
    if (httpd_query_key_value(query.c_str(), key, value.data(), value.size()) != ESP_OK) {
        return {};
    }
    value.resize(std::strlen(value.c_str()));
    return UrlDecode(value);
}

void DrainBody(httpd_req_t* request, size_t remaining)
{
    char scratch[512];
    while (remaining > 0) {
        const int got = httpd_req_recv(request, scratch, std::min(remaining, sizeof(scratch)));
        if (got <= 0 && got != HTTPD_SOCK_ERR_TIMEOUT) {
            return;
        }
        if (got > 0) {
            remaining -= static_cast<size_t>(got);
        }
    }
}

esp_err_t HandleList(httpd_req_t* request)
{
    const std::string unavailable = CardUnavailableReason();
    if (!unavailable.empty()) {
        return SendMessage(request, "503 Service Unavailable", false, unavailable);
    }
    (void)Init();  // creates the books folder if it is missing
    cJSON* root = cJSON_CreateObject();
    if (root == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    cJSON_AddBoolToObject(root, "success", true);
    cJSON_AddStringToObject(root, "folder", CONFIG_CHRONINKLE_TEXT_READER_FOLDER);
    storage_service::StorageStats stats = {};
    if (storage_service::GetStorageStats(&stats)) {
        cJSON_AddNumberToObject(root, "free_bytes", static_cast<double>(stats.free_bytes));
    }
    cJSON* books = cJSON_AddArrayToObject(root, "books");
    for (const BookEntry& book : ListBooks()) {
        cJSON* item = cJSON_CreateObject();
        cJSON_AddStringToObject(item, "name", book.filename.c_str());
        cJSON_AddNumberToObject(item, "size", static_cast<double>(book.size_bytes));
        cJSON_AddItemToArray(books, item);
    }
    return SendJson(request, "200 OK", root);
}

struct WriteJob {
    std::string filename;
    const char* data = nullptr;
    size_t length = 0;
    std::string error;
};

std::string JoinPath(const std::string& left, const std::string& right)
{
    if (!left.empty() && left.back() == '/') {
        return left + right;
    }
    return left + "/" + right;
}

esp_err_t WriteBookOnMountedFilesystem(const char* mount_point, void* context)
{
    auto* job = static_cast<WriteJob*>(context);
    const std::string folder = JoinPath(mount_point, CONFIG_CHRONINKLE_TEXT_READER_FOLDER);
    struct stat st = {};
    if (stat(folder.c_str(), &st) != 0 && mkdir(folder.c_str(), 0775) != 0 && errno != EEXIST) {
        job->error = "Could not create the books folder on the SD card.";
        return ESP_FAIL;
    }
    const std::string final_path = JoinPath(folder, job->filename);
    // Short 8.3-style temp name: written fully, then renamed over the old book, so an
    // interrupted write never leaves a half book behind.
    const std::string temp_path = JoinPath(folder, "upload.tmp");
    FILE* file = std::fopen(temp_path.c_str(), "wb");
    if (file == nullptr) {
        job->error = "Could not create the file on the SD card.";
        return ESP_FAIL;
    }
    size_t written = 0;
    while (written < job->length) {
        const size_t n = std::fwrite(job->data + written, 1,
                                     std::min<size_t>(job->length - written, 16384), file);
        if (n == 0) {
            break;
        }
        written += n;
    }
    const bool flushed = std::fflush(file) == 0;
    std::fclose(file);
    if (written != job->length || !flushed) {
        unlink(temp_path.c_str());
        job->error = "The SD card is full or could not be written.";
        return ESP_FAIL;
    }
    // Replacing a book: drop the old copy and its saved reading position (it pointed into
    // the old text).
    unlink(final_path.c_str());
    unlink((final_path + ".pos").c_str());
    if (std::rename(temp_path.c_str(), final_path.c_str()) != 0) {
        unlink(temp_path.c_str());
        job->error = "Could not save the book on the SD card.";
        return ESP_FAIL;
    }
    return ESP_OK;
}

esp_err_t HandleUpload(httpd_req_t* request)
{
    const size_t total = request->content_len;
    const std::string unavailable = CardUnavailableReason();
    if (!unavailable.empty()) {
        DrainBody(request, total);
        return SendMessage(request, "503 Service Unavailable", false, unavailable);
    }
    const std::string filename = SanitizeBookFilename(QueryValue(request, "name"));
    if (total == 0) {
        return SendMessage(request, "400 Bad Request", false, "The book is empty.");
    }
    if (total > kMaxBookBytes) {
        DrainBody(request, total);
        return SendMessage(request, "413 Payload Too Large", false,
                           "That book is too large (over 6 MB of text).");
    }
    const size_t largest = heap_caps_get_largest_free_block(MALLOC_CAP_SPIRAM);
    if (largest < total + kPsramReserveBytes) {
        DrainBody(request, total);
        return SendMessage(request, "507 Insufficient Storage", false,
                           "Not enough free memory on the device for a book this size.");
    }
    std::unique_ptr<char, PsramFree> buffer(
        static_cast<char*>(heap_caps_malloc(total, MALLOC_CAP_SPIRAM)));
    if (!buffer) {
        DrainBody(request, total);
        return SendMessage(request, "507 Insufficient Storage", false,
                           "Not enough free memory on the device for a book this size.");
    }

    size_t received = 0;
    int timeouts = 0;
    while (received < total) {
        const int got = httpd_req_recv(request, buffer.get() + received,
                                       std::min(total - received, kReceiveChunkBytes));
        if (got == HTTPD_SOCK_ERR_TIMEOUT) {
            if (++timeouts > 10) {
                return SendMessage(request, "408 Request Timeout", false,
                                   "The upload stalled. Please try again.");
            }
            continue;
        }
        if (got <= 0) {
            return SendMessage(request, "400 Bad Request", false,
                               "The connection dropped during the upload. Please try again.");
        }
        timeouts = 0;
        received += static_cast<size_t>(got);
    }
    // The reader shows text; a NUL byte means a binary file (an EPUB or PDF sent as-is).
    if (std::memchr(buffer.get(), '\0', total) != nullptr) {
        return SendMessage(request, "415 Unsupported Media Type", false,
                           "That file is not plain text. Send a .txt or .epub book.");
    }

    WriteJob job = {.filename = filename, .data = buffer.get(), .length = total, .error = {}};
    const esp_err_t err = storage_service::RunWithMountedFilesystem(&WriteBookOnMountedFilesystem,
                                                                    &job);
    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Book upload %s failed: %s", filename.c_str(), esp_err_to_name(err));
        return SendMessage(request, "500 Internal Server Error", false,
                           job.error.empty() ? "Could not save the book." : job.error);
    }
    ESP_LOGI(kTag, "Saved book %s (%u bytes)", filename.c_str(), static_cast<unsigned>(total));
    cJSON* root = cJSON_CreateObject();
    if (root == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    cJSON_AddBoolToObject(root, "success", true);
    cJSON_AddStringToObject(root, "message", ("Saved " + filename).c_str());
    cJSON_AddStringToObject(root, "name", filename.c_str());
    cJSON_AddNumberToObject(root, "size", static_cast<double>(total));
    return SendJson(request, "200 OK", root);
}

esp_err_t HandleDelete(httpd_req_t* request)
{
    DrainBody(request, request->content_len);
    const std::string unavailable = CardUnavailableReason();
    if (!unavailable.empty()) {
        return SendMessage(request, "503 Service Unavailable", false, unavailable);
    }
    const std::string name = QueryValue(request, "name");
    // Only names that are actually in the folder: never a path built from the request.
    bool found = false;
    for (const BookEntry& book : ListBooks()) {
        if (book.filename == name) {
            found = true;
            break;
        }
    }
    if (!found) {
        return SendMessage(request, "404 Not Found", false, "That book is not on the device.");
    }
    if (!DeleteBook(name)) {
        return SendMessage(request, "500 Internal Server Error", false,
                           "Could not delete the book.");
    }
    return SendMessage(request, "200 OK", true, "Deleted " + name);
}

}  // namespace

void RegisterPortalRoutes(httpd_handle_t server)
{
    if (server == nullptr) {
        return;
    }
    httpd_uri_t list = {};
    list.uri = kListUri;
    list.method = HTTP_GET;
    list.handler = HandleList;
    httpd_uri_t upload = {};
    upload.uri = kUploadUri;
    upload.method = HTTP_POST;
    upload.handler = HandleUpload;
    httpd_uri_t remove = {};
    remove.uri = kDeleteUri;
    remove.method = HTTP_POST;
    remove.handler = HandleDelete;
    for (const httpd_uri_t* route : {&list, &upload, &remove}) {
        const esp_err_t err = httpd_register_uri_handler(server, route);
        if (err != ESP_OK) {
            ESP_LOGW(kTag, "Register %s failed: %s", route->uri, esp_err_to_name(err));
        }
    }
}

}  // namespace text_reader_service
