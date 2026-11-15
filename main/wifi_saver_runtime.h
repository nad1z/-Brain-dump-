#ifndef WIFI_SAVER_RUNTIME_H_
#define WIFI_SAVER_RUNTIME_H_

// Applies wifi_saver_policy: owns the "Battery saver" setting (NVS namespace "wifi_saver",
// key "enabled"), the user's own Wi-Fi on/off choice while the saver is on, and a 15-second
// check that turns the radio on or off through wifi_service.
namespace wifi_saver_runtime {

void Init();

bool IsEnabled();
void SetEnabled(bool enabled);

// The Wi-Fi page's Wi-Fi toggle. With the saver off this is the plain on/off switch it always
// was. With the saver on, switching Wi-Fi on means "sync now" (the saver turns it off again
// once the work is done) and switching it off means "keep it off" until switched on again.
void HandleWifiToggle(bool currently_on);

}  // namespace wifi_saver_runtime

#endif  // WIFI_SAVER_RUNTIME_H_
