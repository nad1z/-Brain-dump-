#ifndef WIFI_SAVER_POLICY_H_
#define WIFI_SAVER_POLICY_H_

#include <cstdint>

// Battery saver for the Wi-Fi radio: pure decision logic, no ESP-IDF calls, so it is unit-tested
// on the build machine (tests/host/test_wifi_saver_policy.cpp). main/wifi_saver_runtime.cpp
// gathers the inputs and applies the decision.
//
// With the saver on, recordings are saved while the radio is off and marked "waiting for
// transcript"; the radio comes up in bursts to send them, then goes off again.
namespace wifi_saver_policy {

// Wake the radio once this many recordings are waiting ...
inline constexpr int kBatchSize = 3;
// ... or once the oldest waiting recording is this old.
inline constexpr int64_t kMaxWaitSeconds = 30 * 60;
// Keep the radio up this long after the last network work finished, so a follow-up (the next
// recording in a batch, Gemini's readiness check) does not pay for a fresh reconnect.
inline constexpr int64_t kIdleGraceSeconds = 60;
// Give up on a wake that never gets a connection after this long ...
inline constexpr int64_t kConnectTimeoutSeconds = 120;
// ... and do not try again on our own for this long (USB power or "sync now" still can).
inline constexpr int64_t kRetryBackoffSeconds = 15 * 60;

struct Inputs {
    bool saver_enabled = false;
    // The user turned Wi-Fi off on the Wi-Fi page: the saver never turns it back on.
    bool user_disabled = false;
    // The setup hotspot is up: the saver never interferes.
    bool access_point_mode = false;
    // On USB power, battery is not a concern.
    bool usb_power = false;
    // The user asked for a sync (turned Wi-Fi on from the Wi-Fi page while the saver is on).
    bool sync_requested = false;
    int pending_count = 0;
    int64_t oldest_pending_age_s = 0;
    // A transcription, summary, retry batch or firmware update is using the network now.
    bool network_work_in_flight = false;
    bool radio_on = false;
    bool connected = false;
    // Seconds since the radio was last turned on by the saver (meaningful while radio_on).
    int64_t seconds_since_radio_on = 0;
    // Seconds since network work last finished (or since connecting, whichever is later).
    int64_t seconds_since_last_activity = 0;
    // Seconds since the last wake attempt that timed out without connecting; negative if none.
    int64_t seconds_since_failed_wake = -1;
};

enum class Action : uint8_t {
    kNone,        // leave the radio as it is
    kTurnOn,
    kTurnOff,
};

struct Decision {
    Action action = Action::kNone;
    // True when this decision gives up on a wake that could not connect (start the backoff).
    bool wake_failed = false;
};

Decision Decide(const Inputs& inputs);

// True when there is a reason to have the radio up right now (ignoring backoff).
bool WantsRadio(const Inputs& inputs);

}  // namespace wifi_saver_policy

#endif  // WIFI_SAVER_POLICY_H_
