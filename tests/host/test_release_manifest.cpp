// Cloud firmware updates: the release manifest and version ordering
// (components/firmware_update_service/release_manifest).
#include <string>

#include "check.h"
#include "release_manifest.h"

using firmware_update_service::CompareVersions;
using firmware_update_service::IsNewerVersion;
using firmware_update_service::ParseReleaseManifest;
using firmware_update_service::ReleaseManifest;

TEST(manifest_with_every_field_is_read)
{
    ReleaseManifest manifest = {};
    std::string error;
    const bool ok = ParseReleaseManifest(
        R"({"project":"braindump","version":"1.8.0",)"
        R"("url":"https://github.com/o/r/releases/download/v1.8.0/braindump-1.8.0-update.bin",)"
        R"("size":2097152,"sha256":"abc123"})",
        &manifest, &error);
    CHECK(ok);
    CHECK_EQ(manifest.project, std::string("braindump"));
    CHECK_EQ(manifest.version, std::string("1.8.0"));
    CHECK_EQ(manifest.url,
             std::string("https://github.com/o/r/releases/download/v1.8.0/braindump-1.8.0-update.bin"));
    CHECK_EQ(manifest.size, 2097152u);
    CHECK_EQ(manifest.sha256, std::string("abc123"));
}

TEST(manifest_without_sha256_is_still_accepted)
{
    ReleaseManifest manifest = {};
    CHECK(ParseReleaseManifest(
        R"({"project":"braindump","version":"1.8.0","url":"https://x/y.bin","size":10})",
        &manifest, nullptr));
    CHECK(manifest.sha256.empty());
}

TEST(incomplete_or_unsafe_manifests_are_refused)
{
    ReleaseManifest manifest = {};
    manifest.version = "untouched";
    std::string error;
    CHECK(!ParseReleaseManifest("", &manifest, &error));
    CHECK(!ParseReleaseManifest("[1,2]", &manifest, &error));
    CHECK(!ParseReleaseManifest("<html>Not Found</html>", &manifest, &error));
    // Plain http would let anyone on the path swap the image.
    CHECK(!ParseReleaseManifest(
        R"({"project":"braindump","version":"1.8.0","url":"http://x/y.bin","size":10})", &manifest,
        &error));
    CHECK(!ParseReleaseManifest(
        R"({"project":"braindump","version":"1.8.0","url":"https://x/y.bin","size":0})", &manifest,
        &error));
    CHECK(!ParseReleaseManifest(
        R"({"project":"braindump","version":"latest","url":"https://x/y.bin","size":10})",
        &manifest, &error));
    CHECK(!ParseReleaseManifest(R"({"version":"1.8.0","url":"https://x/y.bin","size":10})",
                                &manifest, &error));
    CHECK(!error.empty());
    // A refused manifest leaves the output alone.
    CHECK_EQ(manifest.version, std::string("untouched"));
}

TEST(versions_order_numerically_not_alphabetically)
{
    CHECK(CompareVersions("1.10.0", "1.9.0") > 0);
    CHECK(CompareVersions("1.9.9", "1.10.0") < 0);
    CHECK(CompareVersions("2.0.0", "1.99.99") > 0);
    CHECK_EQ(CompareVersions("1.8.0", "1.8.0"), 0);
    CHECK_EQ(CompareVersions("v1.8.0", "1.8.0"), 0);
    CHECK_EQ(CompareVersions("1.8.0+build.5", "1.8.0"), 0);
}

TEST(pre_releases_come_before_their_release)
{
    CHECK(CompareVersions("1.8.0-rc1", "1.8.0") < 0);
    CHECK(CompareVersions("1.8.0", "1.8.0-rc1") > 0);
    CHECK(CompareVersions("1.8.0-rc2", "1.8.0-rc1") > 0);
    CHECK(CompareVersions("1.8.0-rc1", "1.7.9") > 0);
}

TEST(only_strictly_newer_readable_versions_are_offered)
{
    CHECK(IsNewerVersion("1.8.0", "1.7.0"));
    CHECK(!IsNewerVersion("1.7.0", "1.7.0"));
    CHECK(!IsNewerVersion("1.6.5", "1.7.0"));
    CHECK(!IsNewerVersion("garbage", "1.7.0"));
    CHECK(!IsNewerVersion("1.8", "1.7.0"));
    CHECK(!IsNewerVersion("1.8.0", "not-a-version"));
    bool ok = true;
    CHECK_EQ(CompareVersions("1.8", "1.7.0", &ok), 0);
    CHECK(!ok);
}
