#ifndef FIRMWARE_UPDATE_SERVICE_H_
#define FIRMWARE_UPDATE_SERVICE_H_

#include <cstdint>
#include <string>

#include "esp_http_server.h"

// Over-the-air firmware update, from two sources:
//   - an app image uploaded from the device's web page (POST /api/update), and
//   - the latest GitHub Release, downloaded by the device itself ("cloud" update): a small
//     manifest (release_manifest.h) names the version and the image URL; the device compares
//     versions, then streams the image straight into the spare OTA slot.
//
// Owns: receiving/downloading an app image, writing it to the inactive OTA slot, validating it,
// switching the boot slot, and restarting. Rollback of a build that fails to boot is the
// bootloader's job (CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE); app_shell marks a build valid once
// startup completes.
//
// Does not own: the HTTP server or Wi-Fi (wifi_service), battery policy, or any UI. Those come
// in through SetPrecondition / SetNetworkCheck / SetCloudStatusListener.
namespace firmware_update_service {

// Product-level veto, asked once before an update is accepted (e.g. "battery too low").
// Return false and fill `reason` with a sentence for the user to refuse the update.
using Precondition = bool (*)(std::string* reason);
void SetPrecondition(Precondition precondition);

// True from the first received byte until the device restarts or the update fails, for both
// uploads and cloud installs (only one can run at a time).
bool IsUpdateInProgress();

// ---- Cloud updates (GitHub Releases) ------------------------------------------------------

enum class CloudState : uint8_t {
    kIdle,         // nothing checked since boot
    kChecking,     // reading the release manifest
    kUpToDate,     // the latest release is not newer than this one
    kAvailable,    // a newer release was found; StartCloudInstall() installs it
    kDownloading,  // writing the new image to the spare slot
    kRestarting,   // installed; the device restarts in a moment
    kError,        // the last check or install failed; `message` says why
};

struct CloudStatus {
    CloudState state = CloudState::kIdle;
    std::string installed_version;
    // The newest release found by the last successful check (empty before one).
    std::string latest_version;
    // 0-100 while downloading.
    int progress_percent = 0;
    // One short sentence for the user when state is kError.
    std::string message;
};

// Asked before any cloud work starts: is the device online? Return false and fill `reason`
// with a sentence for the user (e.g. "Connect to Wi-Fi first").
using NetworkCheck = bool (*)(std::string* reason);
void SetNetworkCheck(NetworkCheck check);

// Called (from the update worker task) whenever GetCloudStatus() changes in a way worth
// showing: state changes, and download progress in steps of about 10%.
using CloudStatusListener = void (*)();
void SetCloudStatusListener(CloudStatusListener listener);

CloudStatus GetCloudStatus();

enum class CloudStartResult : uint8_t {
    kStarted,
    kBusy,     // a check, download or upload is already running
    kRefused,  // offline, battery too low, or (install) nothing to install; see `reason`
};

// Reads the latest release's manifest in the background. Ends in kUpToDate, kAvailable or
// kError.
CloudStartResult StartCloudCheck(std::string* reason);

// Downloads and installs the release found by the last check (state must be kAvailable).
// Ends in kRestarting (then the device restarts) or kError (the running firmware is untouched).
CloudStartResult StartCloudInstall(std::string* reason);

// True while a cloud check or download is using the network.
bool IsCloudWorkInFlight();

// Registers:
//   GET  /api/runtime/update        -> installed version, upload progress, and cloud status
//   POST /api/update                -> raw app image (.bin) as the request body
//   POST /api/update/cloud/check    -> StartCloudCheck()
//   POST /api/update/cloud/install  -> StartCloudInstall()
void RegisterPortalRoutes(httpd_handle_t server);

}  // namespace firmware_update_service

#endif  // FIRMWARE_UPDATE_SERVICE_H_
