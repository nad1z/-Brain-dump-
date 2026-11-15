#include "wifi_saver_runtime.h"

#include <atomic>
#include <mutex>

#include "esp_log.h"
#include "esp_timer.h"
#include "nvs.h"
#include "power_service.h"
#include "recording_archive_service.h"
#include "share_service.h"
#include "summary_service.h"
#include "transcription_retry_service.h"
#include "transcription_service.h"
#include "wifi_saver_policy.h"
#include "wifi_service.h"

namespace wifi_saver_runtime {
namespace {

constexpr const char* kTag = "WifiSaver";
constexpr const char* kNvsNamespace = "wifi_saver";
constexpr const char* kNvsEnabledKey = "enabled";
constexpr uint64_t kCheckIntervalUs = 15ULL * 1000 * 1000;

std::mutex s_mutex;
std::atomic<bool> s_enabled{false};
bool s_user_disabled = false;
bool s_sync_requested = false;
bool s_radio_on_by_saver = false;
int64_t s_radio_on_since_us = 0;
int64_t s_last_activity_us = 0;
int64_t s_failed_wake_us = -1;
int64_t s_pending_since_us = -1;
esp_timer_handle_t s_timer = nullptr;

int64_t NowUs()
{
    return esp_timer_get_time();
}

int64_t SecondsSince(int64_t since_us)
{
    return since_us < 0 ? -1 : (NowUs() - since_us) / 1000000;
}

void SaveEnabled(bool enabled)
{
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        ESP_LOGW(kTag, "Could not open NVS to save the battery saver setting");
        return;
    }
    if (nvs_set_u8(handle, kNvsEnabledKey, enabled ? 1 : 0) == ESP_OK) {
        (void)nvs_commit(handle);
    }
    nvs_close(handle);
}

bool LoadEnabled()
{
    nvs_handle_t handle = 0;
    uint8_t value = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) == ESP_OK) {
        (void)nvs_get_u8(handle, kNvsEnabledKey, &value);
        nvs_close(handle);
    }
    return value != 0;
}

bool NetworkWorkInFlight()
{
    return transcription_service::GetSnapshot().request_in_flight ||
           transcription_retry_service::GetSnapshot().batch_in_flight ||
           summary_service::GetSnapshot().request.in_flight || wifi_service::IsBusy() ||
           share_service::IsActive();
}

void Check()
{
    if (!s_enabled.load(std::memory_order_relaxed)) {
        return;
    }

    const wifi_service::UiState wifi = wifi_service::GetUiState();
    power_service::Status power = {};
    const bool usb_power = power_service::ReadStatus(&power) == ESP_OK && power.usb_detected;
    const int pending = recording_archive_service::GetSnapshot().pending_transcription_count;
    const bool work = NetworkWorkInFlight();

    wifi_saver_policy::Inputs inputs = {};
    wifi_saver_policy::Decision decision = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        const int64_t now = NowUs();
        if (pending <= 0) {
            s_pending_since_us = -1;
        } else if (s_pending_since_us < 0) {
            s_pending_since_us = now;
        }
        if (work || (wifi.connected && s_last_activity_us < s_radio_on_since_us)) {
            // Network work just ran, or we just connected: restart the idle grace period.
            s_last_activity_us = now;
        }

        inputs.saver_enabled = true;
        inputs.user_disabled = s_user_disabled;
        inputs.access_point_mode = wifi.access_point_mode;
        inputs.usb_power = usb_power;
        inputs.sync_requested = s_sync_requested;
        inputs.pending_count = pending;
        inputs.oldest_pending_age_s = s_pending_since_us < 0 ? 0 : SecondsSince(s_pending_since_us);
        inputs.network_work_in_flight = work;
        inputs.radio_on = wifi.wifi_enabled;
        inputs.connected = wifi.connected;
        inputs.seconds_since_radio_on = SecondsSince(s_radio_on_since_us);
        inputs.seconds_since_last_activity = SecondsSince(s_last_activity_us);
        inputs.seconds_since_failed_wake = SecondsSince(s_failed_wake_us);
        decision = wifi_saver_policy::Decide(inputs);

        if (decision.action == wifi_saver_policy::Action::kTurnOn) {
            s_radio_on_by_saver = true;
            s_radio_on_since_us = now;
            s_last_activity_us = -1;
        } else if (decision.action == wifi_saver_policy::Action::kTurnOff) {
            s_radio_on_by_saver = false;
            s_sync_requested = false;
            if (decision.wake_failed) {
                s_failed_wake_us = now;
            }
        }
        if (wifi.connected) {
            s_failed_wake_us = -1;
        }
    }

    switch (decision.action) {
        case wifi_saver_policy::Action::kTurnOn:
            ESP_LOGI(kTag, "Radio on: pending=%d usb=%d sync=%d", pending, usb_power ? 1 : 0,
                     inputs.sync_requested ? 1 : 0);
            wifi_service::SetWifiEnabled(true);
            break;
        case wifi_saver_policy::Action::kTurnOff:
            ESP_LOGI(kTag, "Radio off: pending=%d %s", pending,
                     decision.wake_failed ? "(could not connect)" : "(idle)");
            wifi_service::SetWifiEnabled(false);
            break;
        case wifi_saver_policy::Action::kNone:
        default:
            break;
    }
}

}  // namespace

void Init()
{
    s_enabled.store(LoadEnabled(), std::memory_order_relaxed);
    if (s_timer == nullptr) {
        esp_timer_create_args_t args = {};
        args.callback = [](void*) { Check(); };
        args.name = "wifi_saver";
        if (esp_timer_create(&args, &s_timer) != ESP_OK ||
            esp_timer_start_periodic(s_timer, kCheckIntervalUs) != ESP_OK) {
            ESP_LOGE(kTag, "Could not start the battery saver timer");
            s_timer = nullptr;
            return;
        }
    }
    ESP_LOGI(kTag, "Battery saver %s", s_enabled.load() ? "on" : "off");
}

bool IsEnabled()
{
    return s_enabled.load(std::memory_order_relaxed);
}

void SetEnabled(bool enabled)
{
    s_enabled.store(enabled, std::memory_order_relaxed);
    SaveEnabled(enabled);
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_sync_requested = false;
        s_failed_wake_us = -1;
        s_user_disabled = !wifi_service::GetUiState().wifi_enabled && !s_radio_on_by_saver;
    }
    if (!enabled && !wifi_service::GetUiState().wifi_enabled) {
        // Turning the saver off restores the always-on radio, unless the user had it off.
        bool user_disabled = false;
        {
            std::lock_guard<std::mutex> lock(s_mutex);
            user_disabled = s_user_disabled;
        }
        if (!user_disabled) {
            wifi_service::SetWifiEnabled(true);
        }
    }
    ESP_LOGI(kTag, "Battery saver %s", enabled ? "on" : "off");
}

void HandleWifiToggle(bool currently_on)
{
    if (!s_enabled.load(std::memory_order_relaxed)) {
        wifi_service::SetWifiEnabled(!currently_on);
        return;
    }
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (currently_on) {
            s_user_disabled = true;
            s_sync_requested = false;
            s_radio_on_by_saver = false;
        } else {
            s_user_disabled = false;
            s_sync_requested = true;
            s_failed_wake_us = -1;
            s_radio_on_by_saver = true;
            s_radio_on_since_us = NowUs();
            s_last_activity_us = -1;
        }
    }
    wifi_service::SetWifiEnabled(!currently_on);
}

}  // namespace wifi_saver_runtime
