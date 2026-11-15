// Battery saver: when the Wi-Fi radio is turned on and off (main/wifi_saver_policy).
#include "check.h"
#include "wifi_saver_policy.h"

using wifi_saver_policy::Action;
using wifi_saver_policy::Decide;
using wifi_saver_policy::Inputs;

namespace {

Inputs RadioOff()
{
    Inputs inputs = {};
    inputs.saver_enabled = true;
    return inputs;
}

Inputs ConnectedIdle(int64_t idle_seconds)
{
    Inputs inputs = RadioOff();
    inputs.radio_on = true;
    inputs.connected = true;
    inputs.seconds_since_radio_on = 600;
    inputs.seconds_since_last_activity = idle_seconds;
    return inputs;
}

}  // namespace

TEST(saver_off_never_touches_the_radio)
{
    Inputs inputs = ConnectedIdle(10000);
    inputs.saver_enabled = false;
    CHECK(Decide(inputs).action == Action::kNone);
    inputs = RadioOff();
    inputs.saver_enabled = false;
    inputs.pending_count = 10;
    CHECK(Decide(inputs).action == Action::kNone);
}

TEST(user_switch_off_and_setup_hotspot_are_respected)
{
    Inputs inputs = RadioOff();
    inputs.pending_count = 10;
    inputs.usb_power = true;
    inputs.user_disabled = true;
    CHECK(Decide(inputs).action == Action::kNone);
    inputs.user_disabled = false;
    inputs.access_point_mode = true;
    CHECK(Decide(inputs).action == Action::kNone);
}

TEST(radio_stays_off_for_one_or_two_fresh_recordings)
{
    Inputs inputs = RadioOff();
    inputs.pending_count = wifi_saver_policy::kBatchSize - 1;
    inputs.oldest_pending_age_s = 60;
    CHECK(Decide(inputs).action == Action::kNone);
}

TEST(radio_wakes_for_a_full_batch_or_an_old_recording)
{
    Inputs inputs = RadioOff();
    inputs.pending_count = wifi_saver_policy::kBatchSize;
    CHECK(Decide(inputs).action == Action::kTurnOn);

    inputs = RadioOff();
    inputs.pending_count = 1;
    inputs.oldest_pending_age_s = wifi_saver_policy::kMaxWaitSeconds;
    CHECK(Decide(inputs).action == Action::kTurnOn);
}

TEST(usb_power_and_sync_request_wake_the_radio)
{
    Inputs inputs = RadioOff();
    inputs.usb_power = true;
    CHECK(Decide(inputs).action == Action::kTurnOn);
    inputs = RadioOff();
    inputs.sync_requested = true;
    CHECK(Decide(inputs).action == Action::kTurnOn);
}

TEST(radio_stays_on_while_work_runs_or_on_usb)
{
    Inputs inputs = ConnectedIdle(10000);
    inputs.network_work_in_flight = true;
    CHECK(Decide(inputs).action == Action::kNone);
    inputs.network_work_in_flight = false;
    inputs.usb_power = true;
    CHECK(Decide(inputs).action == Action::kNone);
}

TEST(radio_turns_off_after_the_idle_grace_period)
{
    CHECK(Decide(ConnectedIdle(wifi_saver_policy::kIdleGraceSeconds - 1)).action == Action::kNone);
    const auto decision = Decide(ConnectedIdle(wifi_saver_policy::kIdleGraceSeconds));
    CHECK(decision.action == Action::kTurnOff);
    CHECK(!decision.wake_failed);
}

TEST(radio_waits_a_little_longer_for_a_batch_to_start)
{
    Inputs inputs = ConnectedIdle(wifi_saver_policy::kIdleGraceSeconds + 1);
    inputs.pending_count = 2;
    CHECK(Decide(inputs).action == Action::kNone);
    inputs.seconds_since_last_activity = wifi_saver_policy::kIdleGraceSeconds * 3;
    CHECK(Decide(inputs).action == Action::kTurnOff);
}

TEST(failed_wake_gives_up_and_backs_off)
{
    Inputs inputs = RadioOff();
    inputs.radio_on = true;
    inputs.connected = false;
    inputs.seconds_since_radio_on = wifi_saver_policy::kConnectTimeoutSeconds - 1;
    CHECK(Decide(inputs).action == Action::kNone);
    inputs.seconds_since_radio_on = wifi_saver_policy::kConnectTimeoutSeconds;
    const auto decision = Decide(inputs);
    CHECK(decision.action == Action::kTurnOff);
    CHECK(decision.wake_failed);

    // While backing off, a full batch alone does not wake the radio again ...
    Inputs later = RadioOff();
    later.pending_count = 5;
    later.seconds_since_failed_wake = 60;
    CHECK(Decide(later).action == Action::kNone);
    // ... but USB power or a sync request does, and so does the end of the backoff.
    later.usb_power = true;
    CHECK(Decide(later).action == Action::kTurnOn);
    later.usb_power = false;
    later.sync_requested = true;
    CHECK(Decide(later).action == Action::kTurnOn);
    later.sync_requested = false;
    later.seconds_since_failed_wake = wifi_saver_policy::kRetryBackoffSeconds;
    CHECK(Decide(later).action == Action::kTurnOn);
}
