#include "share_names.h"

#include <cctype>
#include <cstdint>
#include <cstdio>

namespace share_service {
namespace {

int HexValue(char ch)
{
    if (ch >= '0' && ch <= '9') {
        return ch - '0';
    }
    if (ch >= 'a' && ch <= 'f') {
        return ch - 'a' + 10;
    }
    if (ch >= 'A' && ch <= 'F') {
        return ch - 'A' + 10;
    }
    return -1;
}

bool EndsWithIgnoreCase(const std::string& text, const std::string& suffix)
{
    if (text.size() < suffix.size()) {
        return false;
    }
    for (size_t index = 0; index < suffix.size(); ++index) {
        const char a = static_cast<char>(
            std::tolower(static_cast<unsigned char>(text[text.size() - suffix.size() + index])));
        if (a != suffix[index]) {
            return false;
        }
    }
    return true;
}

}  // namespace

std::string UrlDecode(const std::string& value)
{
    std::string out;
    out.reserve(value.size());
    for (size_t index = 0; index < value.size(); ++index) {
        const char ch = value[index];
        if (ch == '+') {
            out += ' ';
        } else if (ch == '%' && index + 2 < value.size() &&
                   HexValue(value[index + 1]) >= 0 && HexValue(value[index + 2]) >= 0) {
            out += static_cast<char>(HexValue(value[index + 1]) * 16 + HexValue(value[index + 2]));
            index += 2;
        } else {
            out += ch;
        }
    }
    return out;
}

std::string SanitizeBookName(const std::string& name)
{
    // Base name only: anything after the last '/' or '\'.
    const size_t slash = name.find_last_of("/\\");
    std::string base = slash == std::string::npos ? name : name.substr(slash + 1);

    for (const char* extension : {".epub", ".txt"}) {
        if (EndsWithIgnoreCase(base, extension)) {
            base.resize(base.size() - std::string(extension).size());
            break;
        }
    }

    std::string cleaned;
    for (const char ch : base) {
        const unsigned char byte = static_cast<unsigned char>(ch);
        if (byte < 0x20 || byte == 0x7F) {
            continue;
        }
        switch (ch) {
            case '<': case '>': case ':': case '"': case '|': case '?': case '*':
                cleaned += '_';
                break;
            default:
                cleaned += ch;  // UTF-8 (e.g. Hebrew titles) is kept; FAT long names store it
        }
    }
    // No leading dots or spaces (hidden files / "..") and no trailing dots or spaces (FAT).
    const size_t first = cleaned.find_first_not_of(". ");
    if (first == std::string::npos) {
        return {};
    }
    const size_t last = cleaned.find_last_not_of(". ");
    cleaned = cleaned.substr(first, last - first + 1);
    if (cleaned.size() > 100) {
        // Cut on a UTF-8 character boundary.
        size_t cut = 100;
        while (cut > 0 && (static_cast<unsigned char>(cleaned[cut]) & 0xC0U) == 0x80U) {
            --cut;
        }
        cleaned.resize(cut);
    }
    return cleaned.empty() ? std::string() : cleaned + ".txt";
}

bool IsValidRecordingId(const std::string& id)
{
    if (id.empty() || id.size() > 64) {
        return false;
    }
    for (const char ch : id) {
        if (std::isalnum(static_cast<unsigned char>(ch)) == 0 && ch != '_' && ch != '-') {
            return false;
        }
    }
    return true;
}

std::string PinFromRandom(uint32_t random_value)
{
    char buffer[8] = {};
    std::snprintf(buffer, sizeof(buffer), "%04u", static_cast<unsigned>(random_value % 10000U));
    return buffer;
}

}  // namespace share_service
