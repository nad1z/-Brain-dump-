#ifndef FEEDBACK_SERVICE_H_
#define FEEDBACK_SERVICE_H_

#include "esp_err.h"

namespace feedback_service {

enum class FeedbackEvent {
    kStartup,
    kGeminiConnected,
    kLock,
    kUnlock,
    kRecordingStart,
    kModalOpen,
    kButtonClick,
    kButtonDoubleClick,
    kButtonLongPress,
    kShutdown,
    kError,
};

esp_err_t Init();
esp_err_t Play(FeedbackEvent event);

// Silent mode: no sound at all. Turns the codec's output (and with it the NS4150B speaker
// amplifier) off, so cues, the post-recording review and clip playback are all skipped.
// Saved in NVS ("feedback"/"silent") and applied again by Init().
bool IsSilent();
void SetSilent(bool silent);

}  // namespace feedback_service

#endif  // FEEDBACK_SERVICE_H_
