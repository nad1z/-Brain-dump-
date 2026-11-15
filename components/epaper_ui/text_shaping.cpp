#include "epaper_ui/text_shaping.h"

#include <algorithm>

namespace epaper_font {
namespace {

enum class CharClass : uint8_t { kLeft, kRight, kNumber, kNeutral };

bool IsDirectionMark(uint32_t cp)
{
    return cp == kLeftToRightMark || cp == kRightToLeftMark;
}

bool IsHebrew(uint32_t cp)
{
    return (cp >= 0x0590 && cp <= 0x05FF) || (cp >= 0xFB1D && cp <= 0xFB4F);
}

CharClass Classify(uint32_t cp)
{
    if (IsHebrew(cp) || cp == kRightToLeftMark) {
        return CharClass::kRight;
    }
    if (cp == kLeftToRightMark) {
        return CharClass::kLeft;
    }
    if (cp >= '0' && cp <= '9') {
        return CharClass::kNumber;
    }
    if ((cp >= 'A' && cp <= 'Z') || (cp >= 'a' && cp <= 'z') || (cp >= 0x00C0 && cp <= 0x024F)) {
        return CharClass::kLeft;
    }
    return CharClass::kNeutral;
}

bool IsNumberSeparator(uint32_t cp)
{
    return cp == '.' || cp == ',' || cp == ':' || cp == '/' || cp == '-';
}

uint32_t Mirror(uint32_t cp)
{
    switch (cp) {
        case '(':
            return ')';
        case ')':
            return '(';
        case '[':
            return ']';
        case ']':
            return '[';
        case '{':
            return '}';
        case '}':
            return '{';
        case '<':
            return '>';
        case '>':
            return '<';
        default:
            return cp;
    }
}

// Appends the display form of one decoded codepoint (may append nothing, or several).
void AppendNormalized(uint32_t cp, std::vector<uint32_t>* out)
{
    if (cp == 0x2018 || cp == 0x2019 || cp == 0x05F3 || cp == 0x02BC) {
        out->push_back('\'');
    } else if (cp == 0x201C || cp == 0x201D || cp == 0x05F4) {
        out->push_back('"');
    } else if (cp == 0x2010 || cp == 0x2011 || cp == 0x2013 || cp == 0x2014 || cp == 0x05BE) {
        out->push_back('-');
    } else if (cp == 0x2026) {
        out->insert(out->end(), {'.', '.', '.'});
    } else if (cp == 0x00A0 || cp == 0x202F || cp == 0x2009) {
        out->push_back(' ');
    } else if ((cp >= 0x0591 && cp <= 0x05C7 && cp != 0x05BE && cp != 0x05C0 && cp != 0x05C3 &&
                cp != 0x05C6) ||
               cp == 0x200B || cp == 0x200C || cp == 0x200D ||
               (cp >= 0x202A && cp <= 0x202E) || (cp >= 0x2066 && cp <= 0x2069) ||
               cp == 0xFEFF) {
        // Hebrew cantillation/vowel points and invisible formatting characters: not drawn.
    } else {
        out->push_back(cp);
    }
}

}  // namespace

void DecodeForDisplay(std::string_view text, std::vector<uint32_t>* codepoints)
{
    if (codepoints == nullptr) {
        return;
    }
    codepoints->clear();
    codepoints->reserve(text.size());

    size_t index = 0;
    while (index < text.size()) {
        const uint8_t lead = static_cast<uint8_t>(text[index]);
        if (lead < 0x80) {
            codepoints->push_back(lead);
            ++index;
            continue;
        }

        int extra = 0;
        uint32_t cp = 0;
        if ((lead & 0xE0U) == 0xC0U) {
            extra = 1;
            cp = lead & 0x1FU;
        } else if ((lead & 0xF0U) == 0xE0U) {
            extra = 2;
            cp = lead & 0x0FU;
        } else if ((lead & 0xF8U) == 0xF0U) {
            extra = 3;
            cp = lead & 0x07U;
        } else {
            ++index;  // stray continuation byte: skip
            continue;
        }

        if (index + static_cast<size_t>(extra) >= text.size()) {
            break;  // truncated final sequence: ignore
        }
        bool valid = true;
        for (int offset = 1; offset <= extra; ++offset) {
            const uint8_t next = static_cast<uint8_t>(text[index + static_cast<size_t>(offset)]);
            if ((next & 0xC0U) != 0x80U) {
                valid = false;
                break;
            }
            cp = (cp << 6) | (next & 0x3FU);
        }
        if (!valid) {
            ++index;
            continue;
        }
        index += static_cast<size_t>(extra) + 1U;
        AppendNormalized(cp, codepoints);
    }
}

void ReorderForDisplay(std::vector<uint32_t>* codepoints)
{
    if (codepoints == nullptr) {
        return;
    }
    std::vector<uint32_t>& text = *codepoints;
    const size_t count = text.size();

    std::vector<CharClass> classes(count);
    bool any_right = false;
    bool base_rtl = false;
    bool base_found = false;
    for (size_t i = 0; i < count; ++i) {
        classes[i] = Classify(text[i]);
        if (classes[i] == CharClass::kRight) {
            any_right = true;
        }
        if (!base_found && (classes[i] == CharClass::kRight || classes[i] == CharClass::kLeft)) {
            base_found = true;
            base_rtl = classes[i] == CharClass::kRight;
        }
    }
    if (!any_right) {
        // Nothing right-to-left on this line: order is already correct.
        text.erase(std::remove_if(text.begin(), text.end(), IsDirectionMark), text.end());
        return;
    }

    // A separator between two digits belongs to the number ("12:30", "1,000", "3.5").
    for (size_t i = 1; i + 1 < count; ++i) {
        if (classes[i] == CharClass::kNeutral && IsNumberSeparator(text[i]) &&
            classes[i - 1] == CharClass::kNumber && classes[i + 1] == CharClass::kNumber) {
            classes[i] = CharClass::kNumber;
        }
    }

    // Embedding levels: 0 = left-to-right, 1 = right-to-left, 2 = left-to-right text nested
    // inside right-to-left (Latin words and numbers within Hebrew).
    std::vector<uint8_t> levels(count);
    const uint8_t base_level = base_rtl ? 1 : 0;
    bool last_strong_right = base_rtl;
    for (size_t i = 0; i < count; ++i) {
        switch (classes[i]) {
            case CharClass::kRight:
                levels[i] = 1;
                last_strong_right = true;
                break;
            case CharClass::kLeft:
                levels[i] = base_rtl ? 2 : 0;
                last_strong_right = false;
                break;
            case CharClass::kNumber:
                levels[i] = (base_rtl || last_strong_right) ? 2 : 0;
                break;
            case CharClass::kNeutral:
            default:
                levels[i] = 0xFF;  // resolved below
                break;
        }
    }

    // Neutrals (spaces, punctuation) take the direction of the text on both sides when those
    // agree, otherwise the line's base direction. Numbers count as right-to-left context only
    // when they sit at the nested level.
    size_t i = 0;
    while (i < count) {
        if (levels[i] != 0xFF) {
            ++i;
            continue;
        }
        size_t end = i;
        while (end < count && levels[end] == 0xFF) {
            ++end;
        }
        const auto direction_of = [&](size_t index) -> int {
            if (classes[index] == CharClass::kRight) {
                return 1;
            }
            if (classes[index] == CharClass::kNumber) {
                return levels[index] == 2 ? 1 : 0;
            }
            return 0;
        };
        const int before = i > 0 ? direction_of(i - 1) : base_level;
        const int after = end < count ? direction_of(end) : base_level;
        const uint8_t resolved = (before == after) ? static_cast<uint8_t>(before) : base_level;
        for (size_t k = i; k < end; ++k) {
            levels[k] = resolved;
        }
        i = end;
    }

    for (size_t k = 0; k < count; ++k) {
        if ((levels[k] & 1U) != 0) {
            text[k] = Mirror(text[k]);
        }
    }

    // Reverse every run at or above each level, highest first.
    for (uint8_t level = 2; level >= 1; --level) {
        size_t start = 0;
        while (start < count) {
            if (levels[start] < level) {
                ++start;
                continue;
            }
            size_t end = start;
            while (end < count && levels[end] >= level) {
                ++end;
            }
            std::reverse(text.begin() + static_cast<std::ptrdiff_t>(start),
                         text.begin() + static_cast<std::ptrdiff_t>(end));
            start = end;
        }
    }

    // Direction marks have done their job (setting the line's direction); they are not drawn.
    text.erase(std::remove_if(text.begin(), text.end(), IsDirectionMark), text.end());
}

bool IsRightToLeft(std::string_view text)
{
    if (IsPlainAscii(text)) {
        return false;
    }
    std::vector<uint32_t> codepoints;
    DecodeForDisplay(text, &codepoints);
    for (const uint32_t cp : codepoints) {
        const CharClass char_class = Classify(cp);
        if (char_class == CharClass::kRight) {
            return true;
        }
        if (char_class == CharClass::kLeft) {
            return false;
        }
    }
    return false;
}

}  // namespace epaper_font
