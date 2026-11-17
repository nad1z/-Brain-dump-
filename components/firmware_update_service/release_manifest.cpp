#include "release_manifest.h"

#include <cstdlib>
#include <string>

#include "cJSON.h"

namespace firmware_update_service {
namespace {

struct ParsedVersion {
    long part[3] = {0, 0, 0};
    std::string pre_release;  // empty for a release
};

bool ParseVersion(std::string_view text, ParsedVersion* out)
{
    if (!text.empty() && (text.front() == 'v' || text.front() == 'V')) {
        text.remove_prefix(1);
    }
    size_t pos = 0;
    for (int index = 0; index < 3; ++index) {
        if (pos >= text.size() || text[pos] < '0' || text[pos] > '9') {
            return false;
        }
        long value = 0;
        while (pos < text.size() && text[pos] >= '0' && text[pos] <= '9') {
            value = value * 10 + (text[pos] - '0');
            if (value > 1000000) {
                return false;
            }
            ++pos;
        }
        out->part[index] = value;
        if (index < 2) {
            if (pos >= text.size() || text[pos] != '.') {
                return false;
            }
            ++pos;
        }
    }
    if (pos == text.size()) {
        out->pre_release.clear();
        return true;
    }
    if (text[pos] == '+') {
        // Build metadata does not affect ordering.
        out->pre_release.clear();
        return true;
    }
    if (text[pos] != '-' || pos + 1 >= text.size()) {
        return false;
    }
    std::string_view rest = text.substr(pos + 1);
    const size_t plus = rest.find('+');
    if (plus != std::string_view::npos) {
        rest = rest.substr(0, plus);
    }
    if (rest.empty()) {
        return false;
    }
    out->pre_release.assign(rest.data(), rest.size());
    return true;
}

const char* StringField(const cJSON* root, const char* name)
{
    const cJSON* item = cJSON_GetObjectItemCaseSensitive(root, name);
    return cJSON_IsString(item) && item->valuestring != nullptr ? item->valuestring : nullptr;
}

bool Fail(std::string* error, const char* reason)
{
    if (error != nullptr) {
        *error = reason;
    }
    return false;
}

}  // namespace

bool ParseReleaseManifest(std::string_view json, ReleaseManifest* manifest, std::string* error)
{
    if (manifest == nullptr) {
        return Fail(error, "no output");
    }
    cJSON* root = cJSON_ParseWithLength(json.data(), json.size());
    if (root == nullptr || !cJSON_IsObject(root)) {
        cJSON_Delete(root);
        return Fail(error, "not a JSON object");
    }

    ReleaseManifest parsed = {};
    const char* project = StringField(root, "project");
    const char* version = StringField(root, "version");
    const char* url = StringField(root, "url");
    const char* sha256 = StringField(root, "sha256");
    const cJSON* size = cJSON_GetObjectItemCaseSensitive(root, "size");

    bool ok = true;
    const char* reason = nullptr;
    if (project == nullptr || project[0] == '\0') {
        ok = false;
        reason = "missing project";
    } else if (version == nullptr || version[0] == '\0') {
        ok = false;
        reason = "missing version";
    } else if (url == nullptr || std::string_view(url).rfind("https://", 0) != 0) {
        ok = false;
        reason = "missing or non-https url";
    } else if (!cJSON_IsNumber(size) || size->valuedouble <= 0 || size->valuedouble > 0xFFFFFFFF) {
        ok = false;
        reason = "missing or invalid size";
    } else {
        ParsedVersion unused = {};
        if (!ParseVersion(version, &unused)) {
            ok = false;
            reason = "unreadable version";
        }
    }

    if (ok) {
        parsed.project = project;
        parsed.version = version;
        parsed.url = url;
        parsed.size = static_cast<uint32_t>(size->valuedouble);
        parsed.sha256 = sha256 != nullptr ? sha256 : "";
    }
    cJSON_Delete(root);
    if (!ok) {
        return Fail(error, reason);
    }
    *manifest = std::move(parsed);
    return true;
}

int CompareVersions(std::string_view a, std::string_view b, bool* ok)
{
    ParsedVersion left = {};
    ParsedVersion right = {};
    const bool readable = ParseVersion(a, &left) && ParseVersion(b, &right);
    if (ok != nullptr) {
        *ok = readable;
    }
    if (!readable) {
        return 0;
    }
    for (int index = 0; index < 3; ++index) {
        if (left.part[index] != right.part[index]) {
            return left.part[index] < right.part[index] ? -1 : 1;
        }
    }
    if (left.pre_release == right.pre_release) {
        return 0;
    }
    if (left.pre_release.empty()) {
        return 1;
    }
    if (right.pre_release.empty()) {
        return -1;
    }
    return left.pre_release < right.pre_release ? -1 : 1;
}

bool IsNewerVersion(std::string_view candidate, std::string_view installed)
{
    bool ok = false;
    const int order = CompareVersions(candidate, installed, &ok);
    return ok && order > 0;
}

}  // namespace firmware_update_service
