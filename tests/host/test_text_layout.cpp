// Hebrew glyph lookup, measuring, wrapping and alignment (epaper_ui fonts + render_utils).
#include <string>
#include <vector>

#include "check.h"
#include "design_tokens.h"
#include "epaper_ui/bitmap_font.h"
#include "epaper_ui/book_reader_page.h"
#include "epaper_ui/font_renderer.h"
#include "epaper_ui/generated_epaper_fonts.h"
#include "epaper_ui/text_shaping.h"
#include "render_utils.h"

namespace {
const auto kBody = design::TypographyRole::kBody;
const std::string kShalom = "\xD7\xA9\xD7\x9C\xD7\x95\xD7\x9D";  // shin lamed vav final-mem
const std::string kRlm = epaper_font::kRightToLeftMarkUtf8;
}  // namespace

TEST(every_hebrew_letter_has_a_glyph_in_every_text_size)
{
    const epaper_font::BitmapFont* fonts[] = {
        &epaper_fonts::kInter22SemiBold, &epaper_fonts::kInter26Bold, &epaper_fonts::kInter32Black,
        &epaper_fonts::kInter38SemiBold, &epaper_fonts::kInter46Bold, &epaper_fonts::kInter55Black,
    };
    for (const epaper_font::BitmapFont* font : fonts) {
        for (uint32_t cp = 0x05D0; cp <= 0x05EA; ++cp) {
            const epaper_font::GlyphRef ref = epaper_font::FindGlyphForCodepoint(*font, cp);
            CHECK(ref.glyph != nullptr);
            CHECK(ref.bitmaps != nullptr && ref.bitmaps != font->bitmaps);
            CHECK(ref.glyph != nullptr && ref.glyph->advance > 0 && ref.glyph->width > 0);
        }
    }
}

TEST(unknown_characters_fall_back_to_question_mark)
{
    const epaper_font::BitmapFont& font = epaper_fonts::kInter22SemiBold;
    const epaper_font::GlyphRef emoji = epaper_font::FindGlyphForCodepoint(font, 0x1F600);
    CHECK(emoji.glyph == epaper_font::FindGlyph(font, '?'));
    // ASCII still resolves to exactly the glyph the old byte lookup returned.
    CHECK(epaper_font::FindGlyphForCodepoint(font, 'A').glyph == epaper_font::FindGlyph(font, 'A'));
}

TEST(hebrew_text_has_width_and_marks_have_none)
{
    const int width = epaper_ui::MeasureText(kBody, kShalom);
    CHECK(width > 0);
    CHECK_EQ(epaper_ui::MeasureText(kBody, kRlm + kShalom), width);
    // Mixed text is the sum of its parts (order never changes the width).
    CHECK_EQ(epaper_ui::MeasureText(kBody, kShalom + "12"),
             width + epaper_ui::MeasureText(kBody, "12"));
}

TEST(english_measurement_is_unchanged_by_hebrew_support)
{
    const epaper_font::BitmapFont& font = epaper_fonts::kInter22SemiBold;
    int expected = 0;
    for (const char ch : std::string("Brain Dump")) {
        expected += epaper_font::FindGlyph(font, ch)->advance;
    }
    CHECK_EQ(epaper_font::MeasureText(font, "Brain Dump"), expected);
}

TEST(wrapped_hebrew_paragraph_keeps_direction_on_every_line)
{
    // Hebrew, then an English word that will start the second line.
    const std::string paragraph = kShalom + " " + kShalom + " " + kShalom + " Google " + kShalom;
    const int narrow = epaper_ui::MeasureText(kBody, kShalom + " " + kShalom + " " + kShalom) + 2;
    const std::vector<std::string> lines = epaper_ui::WrapTextToWidth(kBody, paragraph, narrow);
    CHECK(lines.size() >= 2);
    for (const std::string& line : lines) {
        CHECK(epaper_font::IsRightToLeft(line));
        CHECK(epaper_ui::MeasureText(kBody, line) <= narrow);
    }
}

TEST(wrapping_english_adds_no_marks)
{
    const std::vector<std::string> lines =
        epaper_ui::WrapTextToWidth(kBody, "one two three four five six seven", 120);
    CHECK(lines.size() >= 2);
    for (const std::string& line : lines) {
        CHECK(epaper_font::IsPlainAscii(line));
    }
}

TEST(hebrew_lines_are_right_aligned_and_english_left_aligned)
{
    const int box_x = 20;
    const int box_width = 300;
    CHECK_EQ(epaper_ui::TextStartX(kBody, "Hello", box_x, box_width), box_x);
    const int hebrew_x = epaper_ui::TextStartX(kBody, kShalom, box_x, box_width);
    CHECK_EQ(hebrew_x + epaper_ui::MeasureText(kBody, kShalom), box_x + box_width);
}

TEST(ellipsis_fitting_hebrew_never_overflows)
{
    const std::string text = kShalom + " " + kShalom + " " + kShalom + " " + kShalom;
    for (int max_width = 30; max_width < 260; max_width += 23) {
        const std::string fitted = epaper_ui::FitLabelText(kBody, text, max_width);
        CHECK(epaper_ui::MeasureText(kBody, fitted) <= max_width);
    }
}

TEST(book_pages_keep_hebrew_letters)
{
    const std::string book = kShalom + " " + kShalom + ".\n\nSecond paragraph in English.";
    const epaper_ui::BookReaderPageLayout page = epaper_ui::PaginateBookText(480, 800, book);
    CHECK(!page.lines.empty());
    CHECK(!page.lines.empty() && epaper_font::ContainsHebrew(page.lines.front()));
    CHECK(page.consumed_bytes <= book.size());
}
