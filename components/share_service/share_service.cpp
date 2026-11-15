#include "share_service.h"

#include <algorithm>
#include <atomic>
#include <cstdio>
#include <cstring>
#include <memory>
#include <mutex>
#include <new>
#include <string>
#include <vector>

#include "cJSON.h"
#include "esp_log.h"
#include "esp_random.h"
#include "esp_timer.h"
#include "recording_archive_service.h"
#include "share_names.h"
#include "storage_service.h"
#include "text_reader_service.h"
#include "wifi_service.h"

namespace share_service {
namespace {

constexpr const char* kTag = "Share";
constexpr const char* kPinHeader = "X-Share-Pin";
constexpr size_t kChunkBytes = 4096;
constexpr size_t kMaxBookBytes = 16U * 1024U * 1024U;
constexpr int64_t kIdleStopUs = 10LL * 60 * 1000 * 1000;
constexpr uint64_t kIdleCheckUs = 30ULL * 1000 * 1000;
constexpr int kMaxPinFailures = 5;
constexpr int64_t kPinLockoutUs = 60LL * 1000 * 1000;

// Route context: whether the route sits on the PIN-protected home-network server.
struct RouteContext {
    bool require_pin;
};
const RouteContext kSetupContext = {.require_pin = false};
const RouteContext kShareContext = {.require_pin = true};

std::mutex s_mutex;
httpd_handle_t s_server = nullptr;
State s_state = {};
std::atomic<int64_t> s_last_request_us{0};
int s_pin_failures = 0;
int64_t s_pin_locked_until_us = 0;
esp_timer_handle_t s_idle_timer = nullptr;
StoppedHandler s_stopped_handler = nullptr;
void* s_stopped_context = nullptr;

bool RequiresPin(httpd_req_t* request)
{
    const auto* context = static_cast<const RouteContext*>(request->user_ctx);
    return context != nullptr && context->require_pin;
}

esp_err_t SendJson(httpd_req_t* request, const char* status, cJSON* root)
{
    char* text = root != nullptr ? cJSON_PrintUnformatted(root) : nullptr;
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

esp_err_t SendError(httpd_req_t* request, const char* status, const char* message)
{
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", false);
    cJSON_AddStringToObject(root, "message", message);
    return SendJson(request, status, root);
}

std::string QueryValue(httpd_req_t* request, const char* key)
{
    const size_t length = httpd_req_get_url_query_len(request);
    if (length == 0 || length > 512) {
        return {};
    }
    std::string query(length + 1, '\0');
    if (httpd_req_get_url_query_str(request, query.data(), query.size()) != ESP_OK) {
        return {};
    }
    char value[256] = {};
    if (httpd_query_key_value(query.c_str(), key, value, sizeof(value)) != ESP_OK) {
        return {};
    }
    return UrlDecode(value);
}

// Returns true when the request may proceed; otherwise has already sent the refusal.
bool Authorize(httpd_req_t* request, esp_err_t* response)
{
    s_last_request_us.store(esp_timer_get_time(), std::memory_order_relaxed);
    if (!RequiresPin(request)) {
        return true;
    }
    char pin[16] = {};
    const bool has_pin =
        httpd_req_get_hdr_value_str(request, kPinHeader, pin, sizeof(pin)) == ESP_OK;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        const int64_t now = esp_timer_get_time();
        if (now < s_pin_locked_until_us) {
            *response = SendError(request, "429 Too Many Requests",
                                  "Too many wrong PINs. Wait a minute and try again.");
            return false;
        }
        if (has_pin && s_state.active && s_state.pin == pin) {
            s_pin_failures = 0;
            return true;
        }
        if (has_pin && ++s_pin_failures >= kMaxPinFailures) {
            s_pin_failures = 0;
            s_pin_locked_until_us = now + kPinLockoutUs;
        }
    }
    *response = SendError(request, "401 Unauthorized", "Enter the PIN shown on the device.");
    return false;
}

#define AUTHORIZE_OR_RETURN(request)            \
    do {                                        \
        esp_err_t refusal = ESP_OK;             \
        if (!Authorize((request), &refusal)) {  \
            return refusal;                     \
        }                                       \
    } while (false)

esp_err_t HandleStatus(httpd_req_t* request)
{
    s_last_request_us.store(esp_timer_get_time(), std::memory_order_relaxed);
    bool authorized = !RequiresPin(request);
    if (!authorized) {
        char pin[16] = {};
        std::lock_guard<std::mutex> lock(s_mutex);
        authorized = httpd_req_get_hdr_value_str(request, kPinHeader, pin, sizeof(pin)) == ESP_OK &&
                     s_state.active && s_state.pin == pin;
    }
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", true);
    cJSON_AddStringToObject(root, "mode", RequiresPin(request) ? "share" : "setup");
    cJSON_AddBoolToObject(root, "pin_required", RequiresPin(request));
    cJSON_AddBoolToObject(root, "authorized", authorized);
    cJSON_AddBoolToObject(root, "storage_available", storage_service::IsMounted());
    return SendJson(request, HTTPD_200, root);
}

cJSON* RecordingJson(const recording_archive_service::RecordingEntry& entry)
{
    const recording_archive_service::RecordingMetadata& meta = entry.metadata;
    cJSON* item = cJSON_CreateObject();
    cJSON_AddStringToObject(item, "id", entry.recording_id.c_str());
    cJSON_AddNumberToObject(item, "created", static_cast<double>(meta.created_unix_seconds));
    cJSON_AddBoolToObject(item, "time_valid", meta.time_valid);
    cJSON_AddStringToObject(item, "date", meta.created_local_date.c_str());
    cJSON_AddNumberToObject(item, "duration_ms", meta.duration_ms);
    cJSON_AddStringToObject(item, "tag", recording_archive_service::TagName(meta.tag));
    cJSON_AddStringToObject(item, "title", meta.title.c_str());
    cJSON_AddStringToObject(item, "due", meta.due_local.c_str());
    cJSON_AddBoolToObject(item, "completed", meta.completed);
    cJSON_AddBoolToObject(item, "follow_up", meta.follow_up);
    cJSON_AddBoolToObject(item, "pending_transcription", meta.pending_transcription);
    cJSON_AddBoolToObject(item, "has_audio", entry.has_audio_file);
    cJSON_AddStringToObject(item, "transcript", entry.transcript_text.c_str());
    return item;
}

esp_err_t HandleListRecordings(httpd_req_t* request)
{
    AUTHORIZE_OR_RETURN(request);
    if (!storage_service::IsMounted()) {
        return SendError(request, "503 Service Unavailable", "No SD card is available.");
    }
    esp_err_t status = ESP_OK;
    const std::vector<recording_archive_service::RecordingEntry> entries =
        recording_archive_service::ListRecordings(&status);
    if (status != ESP_OK) {
        return SendError(request, HTTPD_500, "Could not read the recordings.");
    }

    // Streamed one recording at a time so a large archive never needs one big JSON string.
    httpd_resp_set_type(request, "application/json");
    httpd_resp_set_hdr(request, "Cache-Control", "no-store");
    esp_err_t err = httpd_resp_send_chunk(request, "{\"success\":true,\"recordings\":[", HTTPD_RESP_USE_STRLEN);
    for (size_t index = 0; index < entries.size() && err == ESP_OK; ++index) {
        cJSON* item = RecordingJson(entries[index]);
        char* text = cJSON_PrintUnformatted(item);
        cJSON_Delete(item);
        if (text == nullptr) {
            err = ESP_ERR_NO_MEM;
            break;
        }
        if (index > 0) {
            err = httpd_resp_send_chunk(request, ",", 1);
        }
        if (err == ESP_OK) {
            err = httpd_resp_send_chunk(request, text, HTTPD_RESP_USE_STRLEN);
        }
        cJSON_free(text);
    }
    if (err == ESP_OK) {
        err = httpd_resp_send_chunk(request, "]}", 2);
    }
    if (err == ESP_OK) {
        err = httpd_resp_send_chunk(request, nullptr, 0);
    }
    return err;
}

esp_err_t StreamFile(httpd_req_t* request, const std::string& path, const char* type,
                     const std::string& download_name)
{
    FILE* file = std::fopen(path.c_str(), "rb");
    if (file == nullptr) {
        return SendError(request, "404 Not Found", "That file is not on the SD card.");
    }
    std::unique_ptr<char[]> buffer(new (std::nothrow) char[kChunkBytes]);
    if (!buffer) {
        std::fclose(file);
        return SendError(request, HTTPD_500, "Out of memory.");
    }
    httpd_resp_set_type(request, type);
    const std::string disposition = "attachment; filename=\"" + download_name + "\"";
    httpd_resp_set_hdr(request, "Content-Disposition", disposition.c_str());
    esp_err_t err = ESP_OK;
    size_t read = 0;
    while (err == ESP_OK && (read = std::fread(buffer.get(), 1, kChunkBytes, file)) > 0) {
        err = httpd_resp_send_chunk(request, buffer.get(), static_cast<ssize_t>(read));
        s_last_request_us.store(esp_timer_get_time(), std::memory_order_relaxed);
    }
    std::fclose(file);
    if (err == ESP_OK) {
        err = httpd_resp_send_chunk(request, nullptr, 0);
    }
    return err;
}

esp_err_t HandleRecordingAudio(httpd_req_t* request)
{
    AUTHORIZE_OR_RETURN(request);
    const std::string id = QueryValue(request, "id");
    if (!IsValidRecordingId(id)) {
        return SendError(request, HTTPD_400, "Unknown recording.");
    }
    for (const auto& entry : recording_archive_service::ListRecordings()) {
        if (entry.recording_id == id) {
            if (!entry.has_audio_file) {
                return SendError(request, "404 Not Found", "This recording has no audio any more.");
            }
            return StreamFile(request, entry.recording_path, "audio/wav", id + ".wav");
        }
    }
    return SendError(request, "404 Not Found", "Unknown recording.");
}

esp_err_t HandleListBooks(httpd_req_t* request)
{
    AUTHORIZE_OR_RETURN(request);
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", true);
    cJSON* books = cJSON_AddArrayToObject(root, "books");
    for (const auto& book : text_reader_service::ListBooks()) {
        cJSON* item = cJSON_CreateObject();
        cJSON_AddStringToObject(item, "name", book.filename.c_str());
        cJSON_AddNumberToObject(item, "size", static_cast<double>(book.size_bytes));
        cJSON_AddItemToArray(books, item);
    }
    return SendJson(request, HTTPD_200, root);
}

// Drains the rest of a rejected upload so the browser sees the error, not a reset.
void Drain(httpd_req_t* request, size_t remaining, char* buffer)
{
    int timeouts = 0;
    while (remaining > 0) {
        const int got = httpd_req_recv(request, buffer, std::min(remaining, kChunkBytes));
        if (got == HTTPD_SOCK_ERR_TIMEOUT && ++timeouts < 3) {
            continue;
        }
        if (got <= 0) {
            return;
        }
        remaining -= static_cast<size_t>(got);
    }
}

esp_err_t HandleUploadBook(httpd_req_t* request)
{
    AUTHORIZE_OR_RETURN(request);
    std::unique_ptr<char[]> buffer(new (std::nothrow) char[kChunkBytes]);
    if (!buffer) {
        return SendError(request, HTTPD_500, "Out of memory.");
    }
    const size_t total = request->content_len;
    const std::string name = SanitizeBookName(QueryValue(request, "name"));
    const char* refusal = nullptr;
    if (name.empty()) {
        refusal = "That file name cannot be used.";
    } else if (total == 0 || total > kMaxBookBytes) {
        refusal = "Books must be between 1 byte and 16 MB of text.";
    } else if (!storage_service::IsMounted()) {
        refusal = "No SD card is available.";
    }
    if (refusal != nullptr) {
        Drain(request, total, buffer.get());
        return SendError(request, HTTPD_400, refusal);
    }

    (void)text_reader_service::Init();  // creates the folder if it is missing
    const std::string folder = text_reader_service::BookFolderPath();
    const std::string temp_path = folder + "/.upload.tmp";
    const std::string final_path = folder + "/" + name;
    FILE* file = std::fopen(temp_path.c_str(), "wb");
    if (file == nullptr) {
        Drain(request, total, buffer.get());
        return SendError(request, HTTPD_500, "Could not write to the SD card.");
    }

    size_t remaining = total;
    int timeouts = 0;
    bool ok = true;
    while (remaining > 0) {
        const int got = httpd_req_recv(request, buffer.get(), std::min(remaining, kChunkBytes));
        if (got == HTTPD_SOCK_ERR_TIMEOUT) {
            if (++timeouts > 10) {
                ok = false;
                break;
            }
            continue;
        }
        if (got <= 0) {
            ok = false;
            break;
        }
        timeouts = 0;
        if (std::fwrite(buffer.get(), 1, static_cast<size_t>(got), file) != static_cast<size_t>(got)) {
            ok = false;
            break;
        }
        remaining -= static_cast<size_t>(got);
        s_last_request_us.store(esp_timer_get_time(), std::memory_order_relaxed);
    }
    ok = (std::fclose(file) == 0) && ok;
    if (!ok) {
        std::remove(temp_path.c_str());
        Drain(request, remaining, buffer.get());
        return SendError(request, HTTPD_500, "The upload did not complete. Please try again.");
    }
    std::remove(final_path.c_str());  // replace a book with the same name
    if (std::rename(temp_path.c_str(), final_path.c_str()) != 0) {
        std::remove(temp_path.c_str());
        return SendError(request, HTTPD_500, "Could not save the book.");
    }
    ESP_LOGI(kTag, "Book added: %s (%u bytes)", name.c_str(), static_cast<unsigned>(total));
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", true);
    cJSON_AddStringToObject(root, "name", name.c_str());
    return SendJson(request, HTTPD_200, root);
}

esp_err_t HandleDeleteBook(httpd_req_t* request)
{
    AUTHORIZE_OR_RETURN(request);
    const std::string name = QueryValue(request, "name");
    bool listed = false;
    for (const auto& book : text_reader_service::ListBooks()) {
        listed = listed || book.filename == name;
    }
    if (!listed) {
        return SendError(request, "404 Not Found", "No such book.");
    }
    if (!text_reader_service::DeleteBook(name)) {
        return SendError(request, HTTPD_500, "Could not delete the book.");
    }
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", true);
    return SendJson(request, HTTPD_200, root);
}

esp_err_t RegisterRoutes(httpd_handle_t server, const RouteContext* context)
{
    struct Route {
        const char* uri;
        httpd_method_t method;
        esp_err_t (*handler)(httpd_req_t*);
    };
    const Route routes[] = {
        {"/api/share/status", HTTP_GET, HandleStatus},
        {"/api/recordings", HTTP_GET, HandleListRecordings},
        {"/api/recordings/audio", HTTP_GET, HandleRecordingAudio},
        {"/api/books", HTTP_GET, HandleListBooks},
        {"/api/books", HTTP_POST, HandleUploadBook},
        {"/api/books", HTTP_DELETE, HandleDeleteBook},
    };
    for (const Route& route : routes) {
        httpd_uri_t uri = {};
        uri.uri = route.uri;
        uri.method = route.method;
        uri.handler = route.handler;
        uri.user_ctx = const_cast<RouteContext*>(context);
        const esp_err_t err = httpd_register_uri_handler(server, &uri);
        if (err != ESP_OK) {
            ESP_LOGE(kTag, "Could not register %s: %s", route.uri, esp_err_to_name(err));
            return err;
        }
    }
    return ESP_OK;
}

void IdleCheck(void*)
{
    if (!IsActive()) {
        return;
    }
    const int64_t idle = esp_timer_get_time() - s_last_request_us.load(std::memory_order_relaxed);
    if (idle < kIdleStopUs) {
        return;
    }
    ESP_LOGI(kTag, "Sharing stopped after 10 idle minutes");
    Stop();
    StoppedHandler handler = nullptr;
    void* context = nullptr;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        handler = s_stopped_handler;
        context = s_stopped_context;
    }
    if (handler != nullptr) {
        handler(context);
    }
}

}  // namespace

StartResult Start()
{
    const wifi_service::UiState wifi = wifi_service::GetUiState();
    if (!wifi.connected || wifi.access_point_mode || wifi.ip_address.empty()) {
        return StartResult::kNotConnected;
    }
    if (!storage_service::IsMounted()) {
        return StartResult::kNoSdCard;
    }

    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_server != nullptr) {
        return StartResult::kAlreadyActive;
    }
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.server_port = 80;
    config.ctrl_port = 32770;  // distinct from the setup portal's server
    config.max_uri_handlers = 12;
    config.stack_size = 8192;
    config.lru_purge_enable = true;
    config.uri_match_fn = nullptr;
    httpd_handle_t server = nullptr;
    if (httpd_start(&server, &config) != ESP_OK) {
        ESP_LOGE(kTag, "Could not start the sharing server");
        return StartResult::kFailed;
    }
    if (wifi_service::RegisterPortalPageRoutes(server) != ESP_OK ||
        RegisterRoutes(server, &kShareContext) != ESP_OK) {
        httpd_stop(server);
        return StartResult::kFailed;
    }

    s_server = server;
    s_state.active = true;
    s_state.url = "http://" + wifi.ip_address;
    s_state.pin = PinFromRandom(esp_random());
    s_pin_failures = 0;
    s_pin_locked_until_us = 0;
    s_last_request_us.store(esp_timer_get_time(), std::memory_order_relaxed);

    if (s_idle_timer == nullptr) {
        esp_timer_create_args_t args = {};
        args.callback = IdleCheck;
        args.name = "share_idle";
        if (esp_timer_create(&args, &s_idle_timer) != ESP_OK) {
            s_idle_timer = nullptr;
        }
    }
    if (s_idle_timer != nullptr) {
        (void)esp_timer_start_periodic(s_idle_timer, kIdleCheckUs);
    }
    ESP_LOGI(kTag, "Sharing at %s", s_state.url.c_str());
    return StartResult::kStarted;
}

void Stop()
{
    httpd_handle_t server = nullptr;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        server = s_server;
        s_server = nullptr;
        s_state = {};
        if (s_idle_timer != nullptr) {
            (void)esp_timer_stop(s_idle_timer);
        }
    }
    if (server != nullptr) {
        httpd_stop(server);
        ESP_LOGI(kTag, "Sharing stopped");
    }
}

State GetState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return s_state;
}

bool IsActive()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return s_state.active;
}

void SetStoppedHandler(StoppedHandler handler, void* context)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_stopped_handler = handler;
    s_stopped_context = context;
}

void RegisterSetupRoutes(httpd_handle_t server)
{
    if (server != nullptr) {
        (void)RegisterRoutes(server, &kSetupContext);
    }
}

}  // namespace share_service
