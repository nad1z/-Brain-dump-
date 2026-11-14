#include "epaper_ui/bitmap_font.h"

#include <algorithm>
#include <vector>

#include "epaper_ui/generated_epaper_hebrew_fonts.h"
#include "epaper_ui/text_shaping.h"

namespace epaper_font {

namespace {

char NormalizeGlyphChar(char ch) {
    unsigned char value = static_cast<unsigned char>(ch);
    if (value < 32 || value > 126) {
        return '?';
    }
    return static_cast<char>(value);
}

}  // namespace

const GlyphBitmap* FindGlyph(const BitmapFont& font, char ch) {
    const char normalized = NormalizeGlyphChar(ch);
    if (normalized < static_cast<char>(font.first_char) ||
        normalized > static_cast<char>(font.last_char)) {
        return nullptr;
    }

    const size_t index = static_cast<size_t>(
        static_cast<unsigned char>(normalized) - font.first_char);
    return &font.glyphs[index];
}

GlyphRef FindGlyphForCodepoint(const BitmapFont& font, uint32_t codepoint) {
    if (codepoint >= 0x80) {
        if (codepoint == kLeftToRightMark || codepoint == kRightToLeftMark) {
            return {};  // zero-width
        }
        for (size_t index = 0; index < epaper_fonts::kHebrewRangeCount; ++index) {
            const ExtraGlyphRange& range = epaper_fonts::kHebrewRanges[index];
            if (range.base == &font && codepoint >= range.first_codepoint &&
                codepoint < static_cast<uint32_t>(range.first_codepoint) + range.glyph_count) {
                return {&range.glyphs[codepoint - range.first_codepoint], range.bitmaps};
            }
        }
        codepoint = '?';
    }
    return {FindGlyph(font, static_cast<char>(codepoint)), font.bitmaps};
}

int MeasureText(const BitmapFont& font, std::string_view text, int tracking) {
    int width = 0;
    bool first = true;

    if (!IsPlainAscii(text)) {
        // Width does not depend on drawing order, so no reordering is needed here.
        const size_t line_end = text.find_first_of("\r\n");
        std::vector<uint32_t> codepoints;
        DecodeForDisplay(text.substr(0, line_end), &codepoints);
        for (const uint32_t codepoint : codepoints) {
            const GlyphRef ref = FindGlyphForCodepoint(font, codepoint);
            if (ref.glyph == nullptr) {
                continue;
            }
            if (!first) {
                width += std::max(tracking, 0);
            }
            width += ref.glyph->advance;
            first = false;
        }
        return width;
    }

    for (char ch : text) {
        if (ch == '\r' || ch == '\n') {
            break;
        }
        const GlyphBitmap* glyph = FindGlyph(font, ch);
        if (glyph == nullptr) {
            continue;
        }
        if (!first) {
            width += std::max(tracking, 0);
        }
        width += glyph->advance;
        first = false;
    }

    return width;
}

}  // namespace epaper_font
