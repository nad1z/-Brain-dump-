#include "text_reader_book_filename.h"

#include <cctype>

namespace text_reader_service {
namespace {

constexpr size_t kMaxStemLength = 80;

bool EndsWithIgnoreCase(std::string_view text, std::string_view suffix)
{
    if (text.size() < suffix.size()) {
        return false;
    }
    for (size_t i = 0; i < suffix.size(); ++i) {
        const char a = text[text.size() - suffix.size() + i];
        if (std::tolower(static_cast<unsigned char>(a)) != suffix[i]) {
            return false;
        }
    }
    return true;
}

bool IsKept(char c)
{
    const unsigned char u = static_cast<unsigned char>(c);
    if (u >= 0x80) {
        return false;
    }
    if (std::isalnum(u)) {
        return true;
    }
    switch (c) {
        case '-':
        case '_':
        case '.':
        case '(':
        case ')':
        case ',':
        case '\'':
        case '&':
        case '!':
            return true;
        default:
            return false;
    }
}

int HexValue(char c)
{
    if (c >= '0' && c <= '9') {
        return c - '0';
    }
    if (c >= 'a' && c <= 'f') {
        return c - 'a' + 10;
    }
    if (c >= 'A' && c <= 'F') {
        return c - 'A' + 10;
    }
    return -1;
}

}  // namespace

std::string SanitizeBookFilename(std::string_view requested)
{
    // No folders: keep only what follows the last separator.
    const size_t slash = requested.find_last_of("/\\");
    if (slash != std::string_view::npos) {
        requested.remove_prefix(slash + 1);
    }
    if (EndsWithIgnoreCase(requested, ".txt")) {
        requested.remove_suffix(4);
    } else if (EndsWithIgnoreCase(requested, ".epub")) {
        requested.remove_suffix(5);
    }

    std::string stem;
    bool pending_space = false;
    for (const char c : requested) {
        if (IsKept(c)) {
            if (pending_space && !stem.empty()) {
                stem.push_back(' ');
            }
            pending_space = false;
            stem.push_back(c);
        } else {
            pending_space = true;  // spaces and anything unusable collapse to one space
        }
    }
    // No hidden files (the reader skips dot-files) and no trailing dots or spaces (FAT drops
    // them, which would make the stored name differ from the one we report back).
    size_t start = 0;
    while (start < stem.size() && (stem[start] == '.' || stem[start] == ' ')) {
        ++start;
    }
    stem.erase(0, start);
    if (stem.size() > kMaxStemLength) {
        stem.resize(kMaxStemLength);
    }
    while (!stem.empty() && (stem.back() == '.' || stem.back() == ' ')) {
        stem.pop_back();
    }
    if (stem.empty()) {
        stem = "book";
    }
    return stem + ".txt";
}

std::string UrlDecode(std::string_view value)
{
    std::string out;
    out.reserve(value.size());
    for (size_t i = 0; i < value.size(); ++i) {
        const char c = value[i];
        if (c == '+') {
            out.push_back(' ');
        } else if (c == '%' && i + 2 < value.size()) {
            const int high = HexValue(value[i + 1]);
            const int low = HexValue(value[i + 2]);
            if (high >= 0 && low >= 0) {
                out.push_back(static_cast<char>((high << 4) | low));
                i += 2;
            } else {
                out.push_back(c);
            }
        } else {
            out.push_back(c);
        }
    }
    return out;
}

}  // namespace text_reader_service
