// Cloud firmware updates: read the latest GitHub Release's manifest, and if it is newer, stream
// its app image straight into the spare OTA slot. Nothing is stored anywhere else on the way.
#include <atomic>
#include <cstdint>
#include <cstring>
#include <mutex>
#include <string>

#include "cJSON.h"
#include "chroninkle_task_config.h"
#include "esp_app_desc.h"
#include "esp_crt_bundle.h"
#include "esp_http_client.h"
#include "esp_https_ota.h"
#include "esp_log.h"
#include "esp_ota_ops.h"
#include "firmware_update_internal.h"
#include "firmware_update_service.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "release_manifest.h"
#include "sdkconfig.h"

#ifndef CONFIG_CHRONINKLE_FIRMWARE_UPDATE_MANIFEST_URL
#define CONFIG_CHRONINKLE_FIRMWARE_UPDATE_MANIFEST_URL ""
#endif

namespace firmware_update_service {
namespace {

constexpr const char* kTag = "CloudUpdate";
constexpr const char* kCheckUri = "/api/update/cloud/check";
constexpr const char* kInstallUri = "/api/update/cloud/install";
constexpr const char* kWorkerTaskName = "fw_cloud_update";
// TLS handshake + esp_https_ota + flash writes; matches gemini_service's network worker.
constexpr uint32_t kWorkerTaskStackBytes = 8192;
constexpr size_t kMaxManifestBytes = 4096;
constexpr int kHttpTimeoutMs = 30000;
// GitHub answers release downloads with a redirect to a signed URL that is far longer than
// esp_http_client's 512-byte default request buffer, and with large response headers.
constexpr int kHttpBufferBytes = 4096;
constexpr const char* kUserAgent = "BrainDump-firmware-updater";
constexpr int kProgressStepPercent = 10;

enum class Job : uintptr_t { kCheck = 1, kInstall = 2 };

std::mutex s_mutex;
CloudStatus s_status = {};
ReleaseManifest s_available = {};  // valid while s_status.state == kAvailable
std::atomic<bool> s_worker_busy{false};
std::atomic<NetworkCheck> s_network_check{nullptr};
std::atomic<CloudStatusListener> s_listener{nullptr};

const char* ManifestUrl()
{
    return CONFIG_CHRONINKLE_FIRMWARE_UPDATE_MANIFEST_URL;
}

const char* RunningProject()
{
    return esp_app_get_description()->project_name;
}

void Notify()
{
    const CloudStatusListener listener = s_listener.load(std::memory_order_relaxed);
    if (listener != nullptr) {
        listener();
    }
}

void SetStatus(CloudState state, const std::string& message = {})
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_status.state = state;
        s_status.message = message;
        if (state != CloudState::kDownloading) {
            s_status.progress_percent = state == CloudState::kRestarting ? 100 : 0;
        }
    }
    Notify();
}

void SetError(const std::string& message)
{
    ESP_LOGW(kTag, "%s", message.c_str());
    SetStatus(CloudState::kError, message);
}

const char* StateName(CloudState state)
{
    switch (state) {
        case CloudState::kChecking:
            return "CHECKING";
        case CloudState::kUpToDate:
            return "UP_TO_DATE";
        case CloudState::kAvailable:
            return "AVAILABLE";
        case CloudState::kDownloading:
            return "DOWNLOADING";
        case CloudState::kRestarting:
            return "RESTARTING";
        case CloudState::kError:
            return "ERROR";
        case CloudState::kIdle:
        default:
            return "IDLE";
    }
}

void FillHttpConfig(esp_http_client_config_t* config, const char* url)
{
    config->url = url;
    config->crt_bundle_attach = esp_crt_bundle_attach;
    config->timeout_ms = kHttpTimeoutMs;
    config->buffer_size = kHttpBufferBytes;
    config->buffer_size_tx = kHttpBufferBytes;
    config->keep_alive_enable = true;
    config->user_agent = kUserAgent;
}

// ---- Check ---------------------------------------------------------------------------------

struct ManifestBody {
    std::string data;
    bool too_large = false;
};

esp_err_t OnManifestHttpEvent(esp_http_client_event_t* event)
{
    if (event->event_id != HTTP_EVENT_ON_DATA || event->user_data == nullptr) {
        return ESP_OK;
    }
    // Redirect replies have bodies too; only the final 200 reply is the manifest.
    if (esp_http_client_get_status_code(event->client) != 200) {
        return ESP_OK;
    }
    auto* body = static_cast<ManifestBody*>(event->user_data);
    const size_t length = event->data_len > 0 ? static_cast<size_t>(event->data_len) : 0;
    if (body->data.size() + length > kMaxManifestBytes) {
        body->too_large = true;
        return ESP_OK;
    }
    body->data.append(static_cast<const char*>(event->data), length);
    return ESP_OK;
}

void RunCheck()
{
    ManifestBody body = {};
    esp_http_client_config_t config = {};
    FillHttpConfig(&config, ManifestUrl());
    config.event_handler = OnManifestHttpEvent;
    config.user_data = &body;

    esp_http_client_handle_t client = esp_http_client_init(&config);
    if (client == nullptr) {
        SetError("Not enough memory to check for updates. Try again later.");
        return;
    }
    const esp_err_t err = esp_http_client_perform(client);
    const int status = esp_http_client_get_status_code(client);
    esp_http_client_cleanup(client);

    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Manifest request failed: %s", esp_err_to_name(err));
        SetError("Could not reach the update server. Try again later.");
        return;
    }
    if (status == 404) {
        SetError("No releases have been published yet.");
        return;
    }
    if (status != 200 || body.too_large) {
        ESP_LOGW(kTag, "Manifest request: HTTP %d, %u bytes%s", status,
                 static_cast<unsigned>(body.data.size()), body.too_large ? " (too large)" : "");
        SetError("The update server sent an unexpected reply. Try again later.");
        return;
    }

    ReleaseManifest manifest = {};
    std::string parse_error;
    if (!ParseReleaseManifest(body.data, &manifest, &parse_error)) {
        ESP_LOGW(kTag, "Unreadable manifest: %s", parse_error.c_str());
        SetError("The update server sent an unreadable reply. Try again later.");
        return;
    }
    if (manifest.project != RunningProject()) {
        ESP_LOGW(kTag, "Manifest is for project '%s', this is '%s'", manifest.project.c_str(),
                 RunningProject());
        SetError("The latest release is not for this device.");
        return;
    }

    const char* installed = esp_app_get_description()->version;
    const bool newer = IsNewerVersion(manifest.version, installed);
    ESP_LOGI(kTag, "Latest release %s, installed %s: %s", manifest.version.c_str(), installed,
             newer ? "update available" : "up to date");
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_status.latest_version = manifest.version;
        s_available = newer ? manifest : ReleaseManifest{};
    }
    SetStatus(newer ? CloudState::kAvailable : CloudState::kUpToDate);
}

// ---- Install -------------------------------------------------------------------------------

void RunInstall()
{
    ReleaseManifest manifest = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        manifest = s_available;
    }

    esp_http_client_config_t http_config = {};
    FillHttpConfig(&http_config, manifest.url.c_str());
    esp_https_ota_config_t ota_config = {};
    ota_config.http_config = &http_config;

    esp_https_ota_handle_t handle = nullptr;
    esp_err_t err = esp_https_ota_begin(&ota_config, &handle);
    if (err != ESP_OK || handle == nullptr) {
        ESP_LOGW(kTag, "Download did not start: %s", esp_err_to_name(err));
        internal::EndFailedUpdate();
        SetError("Could not start the download. Try again later.");
        return;
    }

    // Check the image identifies itself as this project before anything is erased.
    esp_app_desc_t incoming = {};
    err = esp_https_ota_get_img_desc(handle, &incoming);
    if (err != ESP_OK ||
        std::strncmp(incoming.project_name, RunningProject(), sizeof(incoming.project_name)) != 0) {
        ESP_LOGW(kTag, "Refusing image: %s, project '%.32s'", esp_err_to_name(err),
                 incoming.project_name);
        esp_https_ota_abort(handle);
        internal::EndFailedUpdate();
        SetError("The downloaded file is not an update for this device. Nothing was changed.");
        return;
    }
    ESP_LOGI(kTag, "Downloading version %.32s", incoming.version);

    int last_reported = 0;
    while (true) {
        err = esp_https_ota_perform(handle);
        if (err != ESP_ERR_HTTPS_OTA_IN_PROGRESS) {
            break;
        }
        const int read = esp_https_ota_get_image_len_read(handle);
        int total = esp_https_ota_get_image_size(handle);
        if (total <= 0) {
            total = static_cast<int>(manifest.size);
        }
        if (read > 0 && total > 0) {
            const int percent =
                static_cast<int>((static_cast<int64_t>(read) * 100) / total);
            if (percent >= last_reported + kProgressStepPercent && percent < 100) {
                last_reported = percent - (percent % kProgressStepPercent);
                {
                    std::lock_guard<std::mutex> lock(s_mutex);
                    s_status.progress_percent = last_reported;
                }
                Notify();
            }
        }
    }

    if (err != ESP_OK || !esp_https_ota_is_complete_data_received(handle)) {
        ESP_LOGW(kTag, "Download failed: %s", esp_err_to_name(err));
        esp_https_ota_abort(handle);
        internal::EndFailedUpdate();
        SetError("The download was interrupted. Nothing was changed.");
        return;
    }

    // Verifies the whole image (checksum and SHA-256) and switches the boot slot.
    err = esp_https_ota_finish(handle);
    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Install failed: %s", esp_err_to_name(err));
        internal::EndFailedUpdate();
        SetError(err == ESP_ERR_OTA_VALIDATE_FAILED
                     ? "The downloaded update is damaged. Nothing was changed."
                     : "Could not install the update. Nothing was changed.");
        return;
    }

    ESP_LOGI(kTag, "Version %s installed; restarting", manifest.version.c_str());
    // The update slot stays claimed until the restart.
    SetStatus(CloudState::kRestarting);
    internal::ScheduleRestart();
}

void WorkerEntry(void* arg)
{
    const Job job = static_cast<Job>(reinterpret_cast<uintptr_t>(arg));
    if (job == Job::kInstall) {
        RunInstall();
    } else {
        RunCheck();
    }
    s_worker_busy.store(false, std::memory_order_release);
    // Let the UI know the worker is free again (e.g. re-enable the button).
    Notify();
    vTaskDelete(nullptr);
}

CloudStartResult Refuse(std::string* reason, const std::string& text)
{
    if (reason != nullptr) {
        *reason = text;
    }
    return CloudStartResult::kRefused;
}

bool NetworkReady(std::string* reason)
{
    const NetworkCheck check = s_network_check.load(std::memory_order_relaxed);
    std::string refusal;
    if (check == nullptr || check(&refusal)) {
        return true;
    }
    if (reason != nullptr) {
        *reason = refusal.empty() ? "Connect to Wi-Fi first" : refusal;
    }
    return false;
}

CloudStartResult Start(Job job, std::string* reason)
{
    if (ManifestUrl()[0] == '\0') {
        return Refuse(reason, "Updates from the internet are turned off in this build");
    }
    if (IsUpdateInProgress()) {
        return Refuse(reason, "An update is already being installed");
    }
    bool expected = false;
    if (!s_worker_busy.compare_exchange_strong(expected, true)) {
        if (reason != nullptr) {
            *reason = "Already checking for updates";
        }
        return CloudStartResult::kBusy;
    }

    std::string refusal;
    if (!NetworkReady(&refusal)) {
        s_worker_busy.store(false, std::memory_order_release);
        return Refuse(reason, refusal);
    }

    if (job == Job::kInstall) {
        bool available = false;
        {
            std::lock_guard<std::mutex> lock(s_mutex);
            available = s_status.state == CloudState::kAvailable && !s_available.url.empty();
        }
        if (!available) {
            s_worker_busy.store(false, std::memory_order_release);
            return Refuse(reason, "Check for updates first");
        }
        if (!internal::RunPrecondition(&refusal)) {
            s_worker_busy.store(false, std::memory_order_release);
            return Refuse(reason, refusal);
        }
        if (!internal::TryBeginUpdate()) {
            s_worker_busy.store(false, std::memory_order_release);
            return Refuse(reason, "An update is already being installed");
        }
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_status.state = job == Job::kInstall ? CloudState::kDownloading : CloudState::kChecking;
        s_status.message.clear();
        s_status.progress_percent = 0;
    }

    const BaseType_t created = xTaskCreatePinnedToCore(
        WorkerEntry, kWorkerTaskName, kWorkerTaskStackBytes,
        reinterpret_cast<void*>(static_cast<uintptr_t>(job)),
        chroninkle_task_config::kPriorityFirmwareUpdate, nullptr,
        chroninkle_task_config::kSystemCore);
    if (created != pdPASS) {
        if (job == Job::kInstall) {
            internal::EndFailedUpdate();
        }
        s_worker_busy.store(false, std::memory_order_release);
        SetError("Not enough memory right now. Try again in a moment.");
        if (reason != nullptr) {
            *reason = "Not enough memory right now. Try again in a moment.";
        }
        return CloudStartResult::kRefused;
    }
    Notify();
    return CloudStartResult::kStarted;
}

// ---- Web page routes -----------------------------------------------------------------------

esp_err_t SendStartReply(httpd_req_t* request, CloudStartResult result, const std::string& reason)
{
    cJSON* root = cJSON_CreateObject();
    if (root == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    const bool started = result == CloudStartResult::kStarted;
    cJSON_AddBoolToObject(root, "success", started);
    cJSON_AddStringToObject(root, "message", started ? "" : reason.c_str());
    internal::AppendCloudRuntime(root);
    char* text = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    if (text == nullptr) {
        return httpd_resp_send_err(request, HTTPD_500_INTERNAL_SERVER_ERROR, "Out of memory");
    }
    httpd_resp_set_status(request, started ? HTTPD_200 : "409 Conflict");
    httpd_resp_set_type(request, "application/json");
    httpd_resp_set_hdr(request, "Cache-Control", "no-store");
    const esp_err_t err = httpd_resp_sendstr(request, text);
    cJSON_free(text);
    return err;
}

esp_err_t HandleCheck(httpd_req_t* request)
{
    std::string reason;
    const CloudStartResult result = StartCloudCheck(&reason);
    return SendStartReply(request, result, reason);
}

esp_err_t HandleInstall(httpd_req_t* request)
{
    std::string reason;
    const CloudStartResult result = StartCloudInstall(&reason);
    return SendStartReply(request, result, reason);
}

}  // namespace

namespace internal {

void AppendCloudRuntime(cJSON* root)
{
    const CloudStatus status = GetCloudStatus();
    cJSON* cloud = cJSON_AddObjectToObject(root, "cloud");
    if (cloud == nullptr) {
        return;
    }
    cJSON_AddBoolToObject(cloud, "enabled", ManifestUrl()[0] != '\0');
    cJSON_AddStringToObject(cloud, "state", StateName(status.state));
    cJSON_AddBoolToObject(cloud, "busy", IsCloudWorkInFlight());
    cJSON_AddStringToObject(cloud, "installed_version", status.installed_version.c_str());
    cJSON_AddStringToObject(cloud, "latest_version", status.latest_version.c_str());
    cJSON_AddNumberToObject(cloud, "progress", status.progress_percent);
    cJSON_AddStringToObject(cloud, "message", status.message.c_str());
}

void RegisterCloudRoutes(httpd_handle_t server)
{
    httpd_uri_t check = {};
    check.uri = kCheckUri;
    check.method = HTTP_POST;
    check.handler = HandleCheck;

    httpd_uri_t install = {};
    install.uri = kInstallUri;
    install.method = HTTP_POST;
    install.handler = HandleInstall;

    if (httpd_register_uri_handler(server, &check) != ESP_OK ||
        httpd_register_uri_handler(server, &install) != ESP_OK) {
        ESP_LOGE(kTag, "Failed to register cloud update routes");
    }
}

}  // namespace internal

void SetNetworkCheck(NetworkCheck check)
{
    s_network_check.store(check, std::memory_order_relaxed);
}

void SetCloudStatusListener(CloudStatusListener listener)
{
    s_listener.store(listener, std::memory_order_relaxed);
}

CloudStatus GetCloudStatus()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    CloudStatus status = s_status;
    status.installed_version = esp_app_get_description()->version;
    return status;
}

CloudStartResult StartCloudCheck(std::string* reason)
{
    return Start(Job::kCheck, reason);
}

CloudStartResult StartCloudInstall(std::string* reason)
{
    return Start(Job::kInstall, reason);
}

bool IsCloudWorkInFlight()
{
    return s_worker_busy.load(std::memory_order_acquire);
}

}  // namespace firmware_update_service
