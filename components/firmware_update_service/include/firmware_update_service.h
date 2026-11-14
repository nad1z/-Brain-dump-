#ifndef FIRMWARE_UPDATE_SERVICE_H_
#define FIRMWARE_UPDATE_SERVICE_H_

#include "esp_http_server.h"

// Over-the-air firmware update, driven from the device's web page.
//
// Owns: receiving an app image over HTTP, writing it to the inactive OTA slot, validating it,
// switching the boot slot, and restarting. Rollback of a build that fails to boot is the
// bootloader's job (CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE); app_shell marks a build valid once
// startup completes.
//
// Does not own: the HTTP server (wifi_service), or any UI.
namespace firmware_update_service {

// True from the first received byte until the device restarts or the upload fails.
bool IsUpdateInProgress();

// Registers:
//   GET  /api/runtime/update  -> installed version + progress of any update in flight
//   POST /api/update          -> raw app image (.bin) as the request body
void RegisterPortalRoutes(httpd_handle_t server);

}  // namespace firmware_update_service

#endif  // FIRMWARE_UPDATE_SERVICE_H_
