#include "wifi_saver_policy.h"

namespace wifi_saver_policy {

bool WantsRadio(const Inputs& inputs)
{
    if (inputs.usb_power || inputs.sync_requested) {
        return true;
    }
    if (inputs.pending_count >= kBatchSize) {
        return true;
    }
    return inputs.pending_count > 0 && inputs.oldest_pending_age_s >= kMaxWaitSeconds;
}

Decision Decide(const Inputs& inputs)
{
    // Not ours to manage: saver off, the user switched Wi-Fi off, or the setup hotspot is up.
    if (!inputs.saver_enabled || inputs.user_disabled || inputs.access_point_mode) {
        return {};
    }

    if (!inputs.radio_on) {
        if (!WantsRadio(inputs)) {
            return {};
        }
        // After a failed wake, only USB power or an explicit sync request may try again early.
        const bool backing_off = inputs.seconds_since_failed_wake >= 0 &&
                                 inputs.seconds_since_failed_wake < kRetryBackoffSeconds;
        if (backing_off && !inputs.usb_power && !inputs.sync_requested) {
            return {};
        }
        return {.action = Action::kTurnOn};
    }

    // Radio is on.
    if (inputs.network_work_in_flight || inputs.usb_power) {
        return {};
    }
    if (!inputs.connected) {
        if (inputs.seconds_since_radio_on >= kConnectTimeoutSeconds) {
            return {.action = Action::kTurnOff, .wake_failed = true};
        }
        return {};
    }
    // Connected and idle: wait out the grace period, and for any recordings still waiting to
    // be picked up by the retry batch (it starts on the connect edge).
    if (inputs.seconds_since_last_activity < kIdleGraceSeconds) {
        return {};
    }
    if (inputs.pending_count > 0 && !inputs.sync_requested &&
        inputs.seconds_since_last_activity < kIdleGraceSeconds * 3) {
        return {};
    }
    return {.action = Action::kTurnOff};
}

}  // namespace wifi_saver_policy
