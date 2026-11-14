#ifndef BITMAP_FONT_H
#define BITMAP_FONT_H

#include <cstddef>
#include <cstdint>
#include <string_view>

namespace epaper_font {

struct GlyphBitmap {
    uint32_t bitmap_offset;
    uint16_t bitmap_byte_count;
    uint8_t width;
    uint8_t height;
    int16_t bearing_x;
    int16_t bearing_y;
    uint8_t advance;
};

struct BitmapFont {
    const char* name;
    uint8_t first_char;
    uint8_t last_char;
    uint8_t line_height;
    uint8_t ascent;
    const GlyphBitmap* glyphs;
    const uint8_t* bitmaps;
};

// Glyphs outside ASCII (currently the Hebrew letters) that accompany one Latin font: same pixel
// size, weight and baseline, stored in their own tables so the generated Latin fonts stay as-is.
struct ExtraGlyphRange {
    const BitmapFont* base;
    uint16_t first_codepoint;
    uint16_t glyph_count;
    const GlyphBitmap* glyphs;
    const uint8_t* bitmaps;
};

// A glyph together with the bitmap table its bitmap_offset indexes into.
struct GlyphRef {
    const GlyphBitmap* glyph = nullptr;
    const uint8_t* bitmaps = nullptr;
};

const GlyphBitmap* FindGlyph(const BitmapFont& font, char ch);
// Unicode-aware lookup: ASCII from the font itself, Hebrew from its companion range, anything
// else (or a font with no companion) as '?'.
GlyphRef FindGlyphForCodepoint(const BitmapFont& font, uint32_t codepoint);
int MeasureText(const BitmapFont& font, std::string_view text, int tracking = 0);

}  // namespace epaper_font

#endif  // BITMAP_FONT_H
