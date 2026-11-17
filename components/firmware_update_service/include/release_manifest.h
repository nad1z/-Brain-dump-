#ifndef FIRMWARE_UPDATE_SERVICE_RELEASE_MANIFEST_H_
#define FIRMWARE_UPDATE_SERVICE_RELEASE_MANIFEST_H_

#include <cstdint>
#include <string>
#include <string_view>

// The small JSON file CI attaches to every GitHub Release (braindump-manifest.json), which the
// device reads to learn what the latest release is before downloading anything:
//
//   {"project": "braindump", "version": "1.8.0",
//    "url": "https://github.com/<owner>/<repo>/releases/download/v1.8.0/braindump-1.8.0-update.bin",
//    "size": 2097152, "sha256": "<hex>"}
//
// Pure logic (cJSON only, no ESP-IDF calls), so it is unit-tested on the build machine
// (tests/host/test_release_manifest.cpp).
namespace firmware_update_service {

struct ReleaseManifest {
    std::string project;
    std::string version;
    std::string url;
    uint32_t size = 0;
    std::string sha256;
};

// Fills `manifest` and returns true when `json` is a complete manifest with an https:// URL.
// Otherwise returns false and, if `error` is non-null, a short reason for the log.
bool ParseReleaseManifest(std::string_view json, ReleaseManifest* manifest, std::string* error);

// Compares "MAJOR.MINOR.PATCH[-pre]" versions (a leading "v" is ignored): negative when `a` is
// older than `b`, zero when equal, positive when newer. A pre-release ("1.8.0-rc1") is older
// than its release ("1.8.0"). Sets `*ok` to false (and returns 0) if either cannot be read.
int CompareVersions(std::string_view a, std::string_view b, bool* ok = nullptr);

// True only when `candidate` is readable and strictly newer than `installed`.
bool IsNewerVersion(std::string_view candidate, std::string_view installed);

}  // namespace firmware_update_service

#endif  // FIRMWARE_UPDATE_SERVICE_RELEASE_MANIFEST_H_
