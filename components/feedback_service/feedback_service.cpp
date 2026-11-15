#include "feedback_service.h"

#include <atomic>

#include "esp_log.h"
#include "nvs.h"
#include "waveshare_board.h"
#include "system_sound_service.h"

namespace feedback_service {
namespace {

constexpr const char* kTag = "FeedbackService";
constexpr const char* kNvsNamespace = "feedback";
constexpr const char* kNvsSilentKey = "silent";

std::atomic<bool> s_silent{false};

bool LoadSilent()
{
    nvs_handle_t handle = 0;
    uint8_t value = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) == ESP_OK) {
        (void)nvs_get_u8(handle, kNvsSilentKey, &value);
        nvs_close(handle);
    }
    return value != 0;
}

void SaveSilent(bool silent)
{
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        ESP_LOGW(kTag, "Could not save silent mode");
        return;
    }
    if (nvs_set_u8(handle, kNvsSilentKey, silent ? 1 : 0) == ESP_OK) {
        (void)nvs_commit(handle);
    }
    nvs_close(handle);
}

void ApplySilent(bool silent)
{
    AudioCodec* codec = waveshare_board::GetAudioCodec();
    if (codec != nullptr) {
        // With output off, the sound task completes every cue as "failed" without touching
        // the codec and playback_service refuses to start, so nothing reaches the speaker.
        codec->EnableOutput(!silent);
    }
}

// Maps a feedback event onto the closest system-sound cue (played through the
// ES8311 codec). There is no dedicated buzzer on this board.
SoundCue CueForEvent(FeedbackEvent event)
{
    switch (event) {
        case FeedbackEvent::kStartup:
            return SoundCue::kStartup;
        case FeedbackEvent::kGeminiConnected:
            return SoundCue::kOnline;
        case FeedbackEvent::kLock:
            return SoundCue::kLock;
        case FeedbackEvent::kUnlock:
            return SoundCue::kUnlock;
        case FeedbackEvent::kRecordingStart:
            return SoundCue::kButtonActivate;
        case FeedbackEvent::kModalOpen:
            return SoundCue::kModalNotification;
        case FeedbackEvent::kButtonClick:
        case FeedbackEvent::kButtonDoubleClick:
        case FeedbackEvent::kButtonLongPress:
            return SoundCue::kButtonActivate;
        case FeedbackEvent::kShutdown:
            return SoundCue::kModalNotification;
        case FeedbackEvent::kError:
        default:
            return SoundCue::kInterrupt;
    }
}

}  // namespace

esp_err_t Init()
{
    AudioCodec* codec = waveshare_board::GetAudioCodec();
    if (codec == nullptr) {
        ESP_LOGW(kTag, "Audio codec unavailable; feedback cues disabled");
        return ESP_ERR_NOT_FOUND;
    }

    // Starts the sound-service playback task and warms (decodes) the cue cache.
    SystemSoundService::GetInstance().Initialize(codec);
    s_silent.store(LoadSilent(), std::memory_order_relaxed);
    if (s_silent.load(std::memory_order_relaxed)) {
        ApplySilent(true);
    }
    ESP_LOGI(kTag, "Feedback service initialized (audio cues via ES8311)%s",
             s_silent.load(std::memory_order_relaxed) ? ", silent mode on" : "");
    return ESP_OK;
}

esp_err_t Play(FeedbackEvent event)
{
    if (s_silent.load(std::memory_order_relaxed)) {
        return ESP_OK;
    }
    SystemSoundService::GetInstance().PlayCue(CueForEvent(event));
    return ESP_OK;
}

bool IsSilent()
{
    return s_silent.load(std::memory_order_relaxed);
}

void SetSilent(bool silent)
{
    s_silent.store(silent, std::memory_order_relaxed);
    SaveSilent(silent);
    ApplySilent(silent);
    ESP_LOGI(kTag, "Silent mode %s", silent ? "on" : "off");
}

}  // namespace feedback_service
