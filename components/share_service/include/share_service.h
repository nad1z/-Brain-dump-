#ifndef SHARE_SERVICE_H_
#define SHARE_SERVICE_H_

#include <string>

#include "esp_http_server.h"

// "Share over WiFi": serves the device's web page on the home network so a phone or computer
// can list, read and download recordings and add or remove books.
//
// Owns: its own HTTP server (started on demand while connected to Wi-Fi, PIN-protected,
// stopped after 10 idle minutes), and the recordings/books HTTP routes, which are also
// registered (without a PIN) on the setup hotspot's server.
// Does not own: Wi-Fi (wifi_service), the files themselves (recording_archive_service,
// text_reader_service), or any on-device UI.
namespace share_service {

enum class StartResult : uint8_t {
    kStarted,
    kAlreadyActive,
    kNotConnected,    // not on a Wi-Fi network (or only the setup hotspot is up)
    kNoSdCard,
    kFailed,
};

struct State {
    bool active = false;
    std::string url = {};  // e.g. "http://192.168.1.23"
    std::string pin = {};  // four digits, new each time sharing starts
};

StartResult Start();
void Stop();
State GetState();
bool IsActive();

// Called (from a timer task) when sharing stops on its own after being idle.
using StoppedHandler = void (*)(void* context);
void SetStoppedHandler(StoppedHandler handler, void* context);

// Registers the recordings/books routes on the setup hotspot's server (no PIN: joining that
// hotspot already means being next to the device).
void RegisterSetupRoutes(httpd_handle_t server);

}  // namespace share_service

#endif  // SHARE_SERVICE_H_
