#include "recording_archive_portal.h"

#include <algorithm>
#include <cstdio>
#include <cstring>
#include <memory>
#include <string>
#include <vector>

#include "cJSON.h"
#include "esp_log.h"
#include "recording_archive_service.h"
#include "storage_service.h"

namespace recording_archive_service {
namespace {

constexpr const char* kTag = "RecordingPortal";
constexpr const char* kListUri = "/api/recordings";
constexpr const char* kAudioUri = "/api/recordings/audio";
constexpr size_t kSendChunkBytes = 4096;

esp_err_t SendMessage(httpd_req_t* request, const char* status, const char* message)
{
    cJSON* root = cJSON_CreateObject();
    if (root == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    cJSON_AddBoolToObject(root, "success", false);
    cJSON_AddStringToObject(root, "message", message);
    char* text = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    if (text == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    httpd_resp_set_status(request, status);
    httpd_resp_set_type(request, "application/json");
    const esp_err_t err = httpd_resp_sendstr(request, text);
    cJSON_free(text);
    return err;
}

const char* CardUnavailableReason()
{
    if (storage_service::IsUsbModeActive()) {
        return "The SD card is connected to a computer (USB drive mode). Turn that off on the "
               "device first.";
    }
    if (!storage_service::IsMounted()) {
        return "No SD card is available. Check that a card is inserted.";
    }
    return nullptr;
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
    return value;  // recording ids are plain ASCII, nothing to decode
}

esp_err_t HandleList(httpd_req_t* request)
{
    if (const char* unavailable = CardUnavailableReason()) {
        return SendMessage(request, "503 Service Unavailable", unavailable);
    }
    esp_err_t status = ESP_OK;
    std::vector<RecordingEntry> entries = ListRecordings(&status);
    if (status != ESP_OK) {
        return SendMessage(request, "500 Internal Server Error",
                           "Could not read the recordings from the SD card.");
    }
    std::sort(entries.begin(), entries.end(), [](const RecordingEntry& a, const RecordingEntry& b) {
        return a.metadata.created_unix_seconds > b.metadata.created_unix_seconds;
    });

    // Streamed one entry at a time: a large archive with transcripts never has to fit in RAM
    // as one JSON document.
    httpd_resp_set_type(request, "application/json");
    httpd_resp_set_hdr(request, "Cache-Control", "no-store");
    esp_err_t err = httpd_resp_send_chunk(request, "{\"success\":true,\"recordings\":[", HTTPD_RESP_USE_STRLEN);
    bool first = true;
    for (const RecordingEntry& entry : entries) {
        if (err != ESP_OK) {
            break;
        }
        cJSON* item = cJSON_CreateObject();
        if (item == nullptr) {
            err = ESP_ERR_NO_MEM;
            break;
        }
        const RecordingMetadata& meta = entry.metadata;
        cJSON_AddStringToObject(item, "id", entry.recording_id.c_str());
        cJSON_AddNumberToObject(item, "created", static_cast<double>(meta.created_unix_seconds));
        cJSON_AddStringToObject(item, "date", meta.created_local_date.c_str());
        cJSON_AddBoolToObject(item, "time_valid", meta.time_valid);
        cJSON_AddNumberToObject(item, "duration_ms", static_cast<double>(meta.duration_ms));
        cJSON_AddStringToObject(item, "tag", TagName(meta.tag));
        cJSON_AddStringToObject(item, "title", meta.title.c_str());
        cJSON_AddStringToObject(item, "transcript", entry.transcript_text.c_str());
        cJSON_AddBoolToObject(item, "has_audio", entry.has_audio_file);
        cJSON_AddBoolToObject(item, "completed", meta.completed);
        cJSON_AddBoolToObject(item, "archived", meta.archived);
        cJSON_AddBoolToObject(item, "follow_up", meta.follow_up);
        char* text = cJSON_PrintUnformatted(item);
        cJSON_Delete(item);
        if (text == nullptr) {
            err = ESP_ERR_NO_MEM;
            break;
        }
        if (!first) {
            err = httpd_resp_send_chunk(request, ",", 1);
        }
        if (err == ESP_OK) {
            err = httpd_resp_send_chunk(request, text, HTTPD_RESP_USE_STRLEN);
        }
        cJSON_free(text);
        first = false;
    }
    if (err == ESP_OK) {
        err = httpd_resp_send_chunk(request, "]}", 2);
    }
    if (err == ESP_OK) {
        err = httpd_resp_send_chunk(request, nullptr, 0);
    }
    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Recording list send failed: %s", esp_err_to_name(err));
    }
    return err;
}

struct StreamJob {
    httpd_req_t* request = nullptr;
    std::string path;
    bool opened = false;
    esp_err_t send_err = ESP_OK;
};

esp_err_t StreamFileOnMountedFilesystem(const char*, void* context)
{
    auto* job = static_cast<StreamJob*>(context);
    FILE* file = std::fopen(job->path.c_str(), "rb");
    if (file == nullptr) {
        return ESP_ERR_NOT_FOUND;
    }
    job->opened = true;
    std::unique_ptr<char[]> buffer(new (std::nothrow) char[kSendChunkBytes]);
    if (!buffer) {
        std::fclose(file);
        job->send_err = ESP_ERR_NO_MEM;
        return ESP_OK;  // not a filesystem failure: don't make storage retry/remount
    }
    httpd_resp_set_type(job->request, "audio/wav");
    while (job->send_err == ESP_OK) {
        const size_t n = std::fread(buffer.get(), 1, kSendChunkBytes, file);
        if (n == 0) {
            break;
        }
        job->send_err = httpd_resp_send_chunk(job->request, buffer.get(), static_cast<ssize_t>(n));
    }
    std::fclose(file);
    if (job->send_err == ESP_OK) {
        job->send_err = httpd_resp_send_chunk(job->request, nullptr, 0);
    }
    return ESP_OK;
}

esp_err_t HandleAudio(httpd_req_t* request)
{
    if (const char* unavailable = CardUnavailableReason()) {
        return SendMessage(request, "503 Service Unavailable", unavailable);
    }
    const std::string id = QueryValue(request, "id");
    const RecordingEntry* match = nullptr;
    std::vector<RecordingEntry> entries = ListRecordings();
    for (const RecordingEntry& entry : entries) {
        if (!id.empty() && entry.recording_id == id) {
            match = &entry;
            break;
        }
    }
    if (match == nullptr) {
        return SendMessage(request, "404 Not Found", "That recording is not on the device.");
    }
    if (!match->has_audio_file) {
        return SendMessage(request, "404 Not Found",
                           "This recording's audio was removed (archived); only its transcript "
                           "is left.");
    }

    // e.g. "2026-11-14-note-20261114T202233.wav"
    std::string filename = match->metadata.created_local_date.empty()
                               ? std::string()
                               : match->metadata.created_local_date + "-";
    filename += TagName(match->metadata.tag);
    filename += "-" + match->recording_id + ".wav";
    const std::string disposition = "attachment; filename=\"" + filename + "\"";
    httpd_resp_set_hdr(request, "Content-Disposition", disposition.c_str());

    StreamJob job = {.request = request, .path = match->recording_path, .opened = false,
                     .send_err = ESP_OK};
    const esp_err_t err =
        storage_service::RunWithMountedFilesystem(&StreamFileOnMountedFilesystem, &job);
    if (!job.opened) {
        return SendMessage(request, "500 Internal Server Error",
                           err == ESP_ERR_NOT_FOUND ? "The audio file is missing on the SD card."
                                                    : "Could not read the SD card.");
    }
    if (job.send_err != ESP_OK) {
        ESP_LOGW(kTag, "Audio download %s stopped: %s", id.c_str(), esp_err_to_name(job.send_err));
    }
    return job.send_err;
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
    httpd_uri_t audio = {};
    audio.uri = kAudioUri;
    audio.method = HTTP_GET;
    audio.handler = HandleAudio;
    for (const httpd_uri_t* route : {&list, &audio}) {
        const esp_err_t err = httpd_register_uri_handler(server, route);
        if (err != ESP_OK) {
            ESP_LOGW(kTag, "Register %s failed: %s", route->uri, esp_err_to_name(err));
        }
    }
}

}  // namespace recording_archive_service
