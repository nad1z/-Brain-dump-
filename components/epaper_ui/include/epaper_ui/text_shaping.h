#ifndef EPAPER_UI_TEXT_SHAPING_H_
#define EPAPER_UI_TEXT_SHAPING_H_

#include <cstddef>
#include <cstdint>
#include <string_view>
#include <vector>

// UTF-8 decoding and right-to-left (Hebrew) ordering for the bitmap text renderer.
//
// Plain ASCII strings never reach this code: callers test IsPlainAscii() first and keep the
// original byte-per-glyph fast path, so English-only screens cost exactly what they did before.
namespace epaper_font {

// Invisible characters that only state a direction. WrapTextToWidth puts a right-to-left mark
// at the start of a wrapped line that belongs to a Hebrew paragraph but happens to begin with
// a Latin word or a number, so the line is still laid out (and aligned) right to left.
inline constexpr uint32_t kLeftToRightMark = 0x200E;
inline constexpr uint32_t kRightToLeftMark = 0x200F;
inline constexpr const char* kRightToLeftMarkUtf8 = "\xE2\x80\x8F";

// True when every byte is 7-bit ASCII (no decoding or reordering needed).
inline bool IsPlainAscii(std::string_view text)
{
    for (const char ch : text) {
        if ((static_cast<unsigned char>(ch) & 0x80U) != 0) {
            return false;
        }
    }
    return true;
}

// True when the UTF-8 text has at least one Hebrew letter (U+05D0..U+05EA).
inline bool ContainsHebrew(std::string_view text)
{
    for (size_t index = 0; index + 1 < text.size(); ++index) {
        const uint8_t next = static_cast<uint8_t>(text[index + 1]);
        if (static_cast<uint8_t>(text[index]) == 0xD7 && next >= 0x90 && next <= 0xAA) {
            return true;
        }
    }
    return false;
}

// Decodes UTF-8 into the codepoints the fonts can draw, in logical (reading) order:
// typographic quotes/dashes/ellipsis become their ASCII forms, Hebrew vowel points and
// invisible direction marks are dropped, and a truncated trailing sequence (left behind by
// byte-wise ellipsis fitting) is silently ignored rather than drawn as '?'.
void DecodeForDisplay(std::string_view text, std::vector<uint32_t>* codepoints);

// Reorders one line of logical-order codepoints into left-to-right drawing order
// (a compact form of the Unicode bidirectional algorithm: Hebrew runs are reversed, numbers
// and Latin words inside them keep reading left to right, brackets are mirrored).
void ReorderForDisplay(std::vector<uint32_t>* codepoints);

// True when the first strongly-directional character of the text is Hebrew, i.e. the line
// should be right-aligned.
bool IsRightToLeft(std::string_view text);

}  // namespace epaper_font

#endif  // EPAPER_UI_TEXT_SHAPING_H_
