#include "changelog_text.h"

#include <array>
#include <cstdlib>
#include <vector>

namespace changelog_text {
namespace {

std::string_view Trim(std::string_view text)
{
    while (!text.empty() && (text.front() == ' ' || text.front() == '\t' || text.front() == '\r')) {
        text.remove_prefix(1);
    }
    while (!text.empty() && (text.back() == ' ' || text.back() == '\t' || text.back() == '\r')) {
        text.remove_suffix(1);
    }
    return text;
}

bool StartsWith(std::string_view text, std::string_view prefix)
{
    return text.substr(0, prefix.size()) == prefix;
}

// Compares "1.10.0" > "1.9.2" numerically, part by part.
int CompareVersions(std::string_view lhs, std::string_view rhs)
{
    while (!lhs.empty() || !rhs.empty()) {
        const size_t lhs_dot = lhs.find('.');
        const size_t rhs_dot = rhs.find('.');
        const int lhs_part = std::atoi(std::string(lhs.substr(0, lhs_dot)).c_str());
        const int rhs_part = std::atoi(std::string(rhs.substr(0, rhs_dot)).c_str());
        if (lhs_part != rhs_part) {
            return lhs_part < rhs_part ? -1 : 1;
        }
        lhs = lhs_dot == std::string_view::npos ? std::string_view() : lhs.substr(lhs_dot + 1);
        rhs = rhs_dot == std::string_view::npos ? std::string_view() : rhs.substr(rhs_dot + 1);
    }
    return 0;
}

// "2026-11-14" -> "14 Nov 2026"; anything else is returned unchanged.
std::string FormatDate(std::string_view iso)
{
    static constexpr std::array<const char*, 12> kMonths = {
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
    if (iso.size() != 10 || iso[4] != '-' || iso[7] != '-') {
        return std::string(iso);
    }
    const int month = std::atoi(std::string(iso.substr(5, 2)).c_str());
    const int day = std::atoi(std::string(iso.substr(8, 2)).c_str());
    if (month < 1 || month > 12 || day < 1) {
        return std::string(iso);
    }
    return std::to_string(day) + " " + kMonths[static_cast<size_t>(month - 1)] + " " +
           std::string(iso.substr(0, 4));
}

// Drops **bold** and `code` markers, turns [text](url) into text, and maps the non-ASCII
// punctuation the changelog uses to ASCII.
std::string PlainText(std::string_view text)
{
    std::string out;
    out.reserve(text.size());
    for (size_t i = 0; i < text.size(); ++i) {
        const char c = text[i];
        if (c == '*' || c == '`') {
            continue;
        }
        if (c == '[') {
            const size_t close = text.find("](", i);
            const size_t end = close == std::string_view::npos ? close : text.find(')', close);
            if (close != std::string_view::npos && end != std::string_view::npos) {
                out.append(text.substr(i + 1, close - i - 1));
                i = end;
                continue;
            }
        }
        if (static_cast<unsigned char>(c) >= 0x80) {
            // UTF-8 sequences used in CHANGELOG.md.
            static constexpr std::array<std::pair<std::string_view, std::string_view>, 9> kMap = {{
                {"\xE2\x80\x94", "-"},    // em dash
                {"\xE2\x80\x93", "-"},    // en dash
                {"\xE2\x86\x92", "->"},   // arrow
                {"\xE2\x80\x98", "'"},
                {"\xE2\x80\x99", "'"},
                {"\xE2\x80\x9C", "\""},
                {"\xE2\x80\x9D", "\""},
                {"\xE2\x80\xA6", "..."},
                {"\xC2\xA0", " "},        // no-break space
            }};
            bool mapped = false;
            for (const auto& [from, to] : kMap) {
                if (text.substr(i, from.size()) == from) {
                    out.append(to);
                    i += from.size() - 1;
                    mapped = true;
                    break;
                }
            }
            if (!mapped) {
                out.push_back(c);  // keep anything else (e.g. Hebrew) as-is
            }
            continue;
        }
        out.push_back(c);
    }
    return out;
}

// The first sentence of `text`: up to and including the first ". " that does not end an
// abbreviation such as "e.g.".
std::string_view FirstSentence(std::string_view text)
{
    size_t from = 0;
    while (true) {
        const size_t dot = text.find(". ", from);
        if (dot == std::string_view::npos) {
            return text;
        }
        const std::string_view before = text.substr(0, dot + 1);
        const bool abbreviation = before.size() >= 4 &&
                                  (before.substr(before.size() - 4) == "e.g." ||
                                   before.substr(before.size() - 4) == "i.e.");
        if (!abbreviation) {
            return before;
        }
        from = dot + 2;
    }
}

// One bullet (continuation lines already joined) -> "Title: first sentence." or the first
// sentence alone.
std::string SummariseEntry(std::string_view entry)
{
    entry = Trim(entry);
    if (StartsWith(entry, "**")) {
        const size_t close = entry.find("**", 2);
        if (close != std::string_view::npos) {
            std::string title = PlainText(Trim(entry.substr(2, close - 2)));
            while (!title.empty() && (title.back() == '.' || title.back() == ':')) {
                title.pop_back();
            }
            const std::string_view rest = Trim(entry.substr(close + 2));
            if (rest.empty()) {
                return title + ".";
            }
            // "**Press twice to go Home** from any screen" reads on as one sentence; a rest that
            // starts a new sentence ("**Auto filing.** The save menu ...") gets a colon.
            const bool continues = rest.front() >= 'a' && rest.front() <= 'z';
            return title + (continues ? " " : ": ") + PlainText(FirstSentence(rest));
        }
    }
    return PlainText(FirstSentence(entry));
}

}  // namespace

std::string BuildDeviceChangelog(std::string_view markdown, std::string_view after_version)
{
    std::string out;
    bool in_version = false;
    std::string entry;  // the bullet being collected

    auto flush_entry = [&]() {
        if (!entry.empty()) {
            out += "- " + SummariseEntry(entry) + "\n";
            entry.clear();
        }
    };

    size_t start = 0;
    while (start <= markdown.size()) {
        const size_t newline = markdown.find('\n', start);
        const std::string_view raw = markdown.substr(
            start, newline == std::string_view::npos ? std::string_view::npos : newline - start);
        start = newline == std::string_view::npos ? markdown.size() + 1 : newline + 1;
        const std::string_view line = Trim(raw);

        if (StartsWith(line, "## [")) {
            flush_entry();
            const size_t close = line.find(']');
            const std::string_view version =
                close == std::string_view::npos ? std::string_view() : line.substr(4, close - 4);
            if (version == "Unreleased") {
                in_version = false;
                continue;
            }
            if (CompareVersions(version, after_version) <= 0) {
                break;  // versions are listed newest first
            }
            const size_t dash = line.find(" - ", close);
            if (!out.empty()) {
                out += "\n";
            }
            out += "Version " + std::string(version);
            if (dash != std::string_view::npos) {
                out += " - " + FormatDate(Trim(line.substr(dash + 3)));
            }
            out += "\n";
            in_version = true;
            continue;
        }
        if (!in_version) {
            continue;
        }
        if (StartsWith(line, "### ")) {
            flush_entry();
            out += std::string(line.substr(4)) + "\n";
            continue;
        }
        if (StartsWith(line, "- ")) {
            flush_entry();
            entry = std::string(line.substr(2));
            continue;
        }
        if (line.empty()) {
            flush_entry();
            continue;
        }
        if (!entry.empty()) {
            entry += " ";
            entry += line;
        }
    }
    flush_entry();
    while (!out.empty() && out.back() == '\n') {
        out.pop_back();
    }
    return out;
}

}  // namespace changelog_text
