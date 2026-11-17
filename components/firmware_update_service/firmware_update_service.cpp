#include "firmware_update_service.h"

#include <algorithm>
#include <atomic>
#include <cstdint>
#include <cstring>
#include <memory>
#include <mutex>
#include <new>
#include <string>

#include "cJSON.h"
#include "esp_app_desc.h"
#include "esp_app_format.h"
#include "esp_image_format.h"
#include "esp_log.h"
#include "esp_ota_ops.h"
#include "esp_system.h"
#include "esp_timer.h"
#include "firmware_update_internal.h"

namespace firmware_update_service {
namespace {

constexpr const char* kTag = "FirmwareUpdate";
constexpr const char* kRuntimeUri = "/api/runtime/update";
constexpr const char* kUploadUri = "/api/update";
constexpr size_t kReceiveBufferBytes = 4096;
// Long enough for the HTTP response to reach the browser before the radio goes away.
constexpr uint64_t kRestartDelayUs = 2000000ULL;
// The app description sits right after the image header and the first segment header.
constexpr size_t kAppDescOffset = sizeof(esp_image_header_t) + sizeof(esp_image_segment_header_t);
constexpr size_t kAppDescEnd = kAppDescOffset + sizeof(esp_app_desc_t);

enum class State : uint8_t { kIdle, kUploading, kSuccess, kError };

std::mutex s_mutex;
State s_state = State::kIdle;
std::string s_error_message;
std::atomic<bool> s_in_progress{false};
std::atomic<uint32_t> s_received{0};
std::atomic<uint32_t> s_total{0};
esp_timer_handle_t s_restart_timer = nullptr;
std::atomic<Precondition> s_precondition{nullptr};

const char* StateName(State state)
{
    switch (state) {
        case State::kUploading:
            return "UPLOADING";
        case State::kSuccess:
            return "SUCCESS";
        case State::kError:
            return "ERROR";
        case State::kIdle:
        default:
            return "IDLE";
    }
}

void SetState(State state, const std::string& error_message = {})
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_state = state;
    s_error_message = error_message;
}

void AppendRuntime(cJSON* root)
{
    State state = State::kIdle;
    std::string error_message;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        state = s_state;
        error_message = s_error_message;
    }
    const uint32_t received = s_received.load(std::memory_order_relaxed);
    const uint32_t total = s_total.load(std::memory_order_relaxed);
    const esp_partition_t* running = esp_ota_get_running_partition();

    cJSON* runtime = cJSON_AddObjectToObject(root, "runtime");
    cJSON_AddBoolToObject(runtime, "active", state == State::kUploading);
    cJSON_AddStringToObject(runtime, "type", "firmware");
    cJSON_AddStringToObject(runtime, "state", StateName(state));
    cJSON_AddNumberToObject(runtime, "received", received);
    cJSON_AddNumberToObject(runtime, "total", total);
    cJSON_AddNumberToObject(runtime, "progress",
                            total > 0 ? static_cast<int>((static_cast<uint64_t>(received) * 100U) / total)
                                      : 0);
    cJSON_AddStringToObject(runtime, "version", esp_app_get_description()->version);
    cJSON_AddStringToObject(runtime, "running_partition",
                            running != nullptr ? running->label : "");
    cJSON_AddBoolToObject(runtime, "completed", state == State::kSuccess);
    cJSON_AddBoolToObject(runtime, "can_abort", false);
    cJSON_AddBoolToObject(runtime, "restart_required", state == State::kSuccess);
    cJSON_AddStringToObject(runtime, "error_message", error_message.c_str());
    internal::AppendCloudRuntime(root);
}

esp_err_t SendJson(httpd_req_t* request, const char* status, bool success, const std::string& message)
{
    cJSON* root = cJSON_CreateObject();
    if (root == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    cJSON_AddBoolToObject(root, "success", success);
    cJSON_AddStringToObject(root, "message", message.c_str());
    AppendRuntime(root);
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

// Drains whatever is left of the request body so the error response is delivered cleanly
// instead of the browser seeing a connection reset mid-upload.
void DrainBody(httpd_req_t* request, size_t remaining, char* buffer)
{
    int timeouts = 0;
    while (remaining > 0) {
        const int got =
            httpd_req_recv(request, buffer, std::min(remaining, kReceiveBufferBytes));
        if (got == HTTPD_SOCK_ERR_TIMEOUT && ++timeouts < 3) {
            continue;
        }
        if (got <= 0) {
            return;
        }
        remaining -= static_cast<size_t>(got);
    }
}

esp_err_t Fail(httpd_req_t* request, const char* status, const std::string& message)
{
    ESP_LOGW(kTag, "Update rejected: %s", message.c_str());
    SetState(State::kError, message);
    internal::EndFailedUpdate();
    return SendJson(request, status, false, message);
}

esp_err_t HandleRuntimeGet(httpd_req_t* request)
{
    return SendJson(request, HTTPD_200, true, "");
}

esp_err_t HandleUpload(httpd_req_t* request)
{
    if (!internal::TryBeginUpdate()) {
        // Do not touch shared state: another update owns it.
        return SendJson(request, "409 Conflict", false, "An update is already in progress");
    }

    const size_t total = request->content_len;
    s_received.store(0, std::memory_order_relaxed);
    s_total.store(static_cast<uint32_t>(total), std::memory_order_relaxed);
    SetState(State::kUploading);

    std::unique_ptr<char[]> buffer(new (std::nothrow) char[kReceiveBufferBytes]);
    if (!buffer) {
        return Fail(request, HTTPD_500, "Not enough memory to receive the update");
    }

    std::string refusal;
    if (!internal::RunPrecondition(&refusal)) {
        DrainBody(request, total, buffer.get());
        return Fail(request, "409 Conflict", refusal);
    }

    const esp_partition_t* target = esp_ota_get_next_update_partition(nullptr);
    if (target == nullptr) {
        DrainBody(request, total, buffer.get());
        return Fail(request, HTTPD_500, "No update slot available on this device");
    }
    if (total < kAppDescEnd || total > target->size) {
        DrainBody(request, total, buffer.get());
        return Fail(request, HTTPD_400, "That file is not a valid firmware image for this device");
    }

    ESP_LOGI(kTag, "Receiving %u bytes into %s", static_cast<unsigned>(total), target->label);

    esp_ota_handle_t handle = 0;
    bool ota_open = false;
    bool header_checked = false;
    // The first kAppDescEnd bytes are held back until the image identifies itself as this
    // project, so a wrong file is refused before anything is erased.
    std::string head;
    head.reserve(kAppDescEnd);
    size_t remaining = total;
    int timeouts = 0;
    std::string failure;

    while (remaining > 0 && failure.empty()) {
        const int got =
            httpd_req_recv(request, buffer.get(), std::min(remaining, kReceiveBufferBytes));
        if (got == HTTPD_SOCK_ERR_TIMEOUT) {
            if (++timeouts > 10) {
                failure = "The upload stalled. Please try again.";
            }
            continue;
        }
        if (got <= 0) {
            failure = "The connection dropped during the upload. Please try again.";
            break;
        }
        timeouts = 0;
        remaining -= static_cast<size_t>(got);

        const char* data = buffer.get();
        size_t length = static_cast<size_t>(got);

        if (!header_checked) {
            const size_t take = std::min(length, kAppDescEnd - head.size());
            head.append(data, take);
            data += take;
            length -= take;
            if (head.size() < kAppDescEnd) {
                continue;
            }

            esp_app_desc_t incoming = {};
            std::memcpy(&incoming, head.data() + kAppDescOffset, sizeof(incoming));
            const esp_app_desc_t* running = esp_app_get_description();
            if (incoming.magic_word != ESP_APP_DESC_MAGIC_WORD ||
                std::strncmp(incoming.project_name, running->project_name,
                             sizeof(incoming.project_name)) != 0) {
                failure = "That file is not a firmware update for this device";
                break;
            }
            ESP_LOGI(kTag, "Incoming firmware version %.32s (running %s)", incoming.version,
                     running->version);

            esp_err_t err = esp_ota_begin(target, OTA_WITH_SEQUENTIAL_WRITES, &handle);
            if (err != ESP_OK) {
                failure = std::string("Could not start the update: ") + esp_err_to_name(err);
                break;
            }
            ota_open = true;
            err = esp_ota_write(handle, head.data(), head.size());
            if (err != ESP_OK) {
                failure = std::string("Could not write the update: ") + esp_err_to_name(err);
                break;
            }
            header_checked = true;
        }

        if (length > 0) {
            const esp_err_t err = esp_ota_write(handle, data, length);
            if (err != ESP_OK) {
                failure = std::string("Could not write the update: ") + esp_err_to_name(err);
                break;
            }
        }
        s_received.store(static_cast<uint32_t>(total - remaining), std::memory_order_relaxed);
    }

    if (failure.empty()) {
        // esp_ota_end verifies the whole image (checksum/hash) before it can be booted.
        esp_err_t err = esp_ota_end(handle);
        ota_open = false;
        if (err != ESP_OK) {
            failure = "The firmware file is damaged or incomplete. Nothing was changed.";
        } else {
            err = esp_ota_set_boot_partition(target);
            if (err != ESP_OK) {
                failure = std::string("Could not activate the update: ") + esp_err_to_name(err);
            }
        }
    }

    if (!failure.empty()) {
        if (ota_open) {
            esp_ota_abort(handle);
        }
        DrainBody(request, remaining, buffer.get());
        return Fail(request, HTTPD_400, failure);
    }

    ESP_LOGI(kTag, "Update written to %s; restarting", target->label);
    SetState(State::kSuccess);
    // The update slot stays claimed: the device is about to restart and must not accept another.
    const esp_err_t response_err =
        SendJson(request, HTTPD_200, true, "Update installed. The device is restarting.");
    internal::ScheduleRestart();
    return response_err;
}

}  // namespace

namespace internal {

bool TryBeginUpdate()
{
    bool expected = false;
    return s_in_progress.compare_exchange_strong(expected, true);
}

void EndFailedUpdate()
{
    s_in_progress.store(false, std::memory_order_relaxed);
}

bool RunPrecondition(std::string* reason)
{
    const Precondition precondition = s_precondition.load(std::memory_order_relaxed);
    std::string refusal;
    if (precondition == nullptr || precondition(&refusal)) {
        return true;
    }
    if (reason != nullptr) {
        *reason = refusal.empty() ? "The device cannot be updated right now" : refusal;
    }
    return false;
}

void ScheduleRestart()
{
    if (s_restart_timer == nullptr) {
        esp_timer_create_args_t args = {};
        args.callback = [](void*) { esp_restart(); };
        args.name = "fw_update_restart";
        if (esp_timer_create(&args, &s_restart_timer) != ESP_OK) {
            s_restart_timer = nullptr;
        }
    }
    if (s_restart_timer == nullptr ||
        esp_timer_start_once(s_restart_timer, kRestartDelayUs) != ESP_OK) {
        esp_restart();
    }
}

}  // namespace internal

void SetPrecondition(Precondition precondition)
{
    s_precondition.store(precondition, std::memory_order_relaxed);
}

bool IsUpdateInProgress()
{
    return s_in_progress.load(std::memory_order_relaxed);
}

void RegisterPortalRoutes(httpd_handle_t server)
{
    if (server == nullptr) {
        return;
    }
    httpd_uri_t runtime_get = {};
    runtime_get.uri = kRuntimeUri;
    runtime_get.method = HTTP_GET;
    runtime_get.handler = HandleRuntimeGet;

    httpd_uri_t upload = {};
    upload.uri = kUploadUri;
    upload.method = HTTP_POST;
    upload.handler = HandleUpload;

    if (httpd_register_uri_handler(server, &runtime_get) != ESP_OK ||
        httpd_register_uri_handler(server, &upload) != ESP_OK) {
        ESP_LOGE(kTag, "Failed to register firmware update routes");
    }
    internal::RegisterCloudRoutes(server);
}

}  // namespace firmware_update_service
