// Hebrew support: UTF-8 decoding and right-to-left ordering (epaper_ui/text_shaping).
#include <string>
#include <vector>

#include "check.h"
#include "epaper_ui/text_shaping.h"

namespace {

std::string ToUtf8(const std::vector<uint32_t>& codepoints)
{
    std::string out;
    for (const uint32_t cp : codepoints) {
        if (cp < 0x80) {
            out += static_cast<char>(cp);
        } else if (cp < 0x800) {
            out += static_cast<char>(0xC0 | (cp >> 6));
            out += static_cast<char>(0x80 | (cp & 0x3F));
        } else {
            out += static_cast<char>(0xE0 | (cp >> 12));
            out += static_cast<char>(0x80 | ((cp >> 6) & 0x3F));
            out += static_cast<char>(0x80 | (cp & 0x3F));
        }
    }
    return out;
}

// Logical (typed) order in, left-to-right drawing order out.
std::string Visual(const std::string& logical)
{
    std::vector<uint32_t> codepoints;
    epaper_font::DecodeForDisplay(logical, &codepoints);
    epaper_font::ReorderForDisplay(&codepoints);
    return ToUtf8(codepoints);
}

// Hebrew letters by codepoint, so the expectations below do not depend on how an editor
// displays right-to-left text.
const std::string kAlef = "\xD7\x90";
const std::string kBet = "\xD7\x91";
const std::string kGimel = "\xD7\x92";
const std::string kDalet = "\xD7\x93";

}  // namespace

TEST(ascii_is_detected_as_plain)
{
    CHECK(epaper_font::IsPlainAscii("Hello, world 123"));
    CHECK(!epaper_font::IsPlainAscii(kAlef));
    CHECK(!epaper_font::ContainsHebrew("Hello"));
    CHECK(epaper_font::ContainsHebrew("Hi " + kAlef));
}

TEST(english_text_is_left_untouched)
{
    CHECK_EQ(Visual("Call the bank at 09:30."), std::string("Call the bank at 09:30."));
}

TEST(hebrew_word_is_reversed_for_drawing)
{
    CHECK_EQ(Visual(kAlef + kBet + kGimel), kGimel + kBet + kAlef);
}

TEST(hebrew_sentence_reverses_word_order_too)
{
    CHECK_EQ(Visual(kAlef + kBet + " " + kGimel + kDalet), kDalet + kGimel + " " + kBet + kAlef);
}

TEST(numbers_inside_hebrew_stay_left_to_right)
{
    CHECK_EQ(Visual(kAlef + kBet + " 12 " + kGimel + kDalet),
             kDalet + kGimel + " 12 " + kBet + kAlef);
    // A time keeps its colon and digit order; the Hebrew prefix ends up to its right.
    CHECK_EQ(Visual(kBet + "-09:30"), "09:30-" + kBet);
    CHECK_EQ(Visual(kAlef + " 1,250 " + kBet), kBet + " 1,250 " + kAlef);
}

TEST(english_word_inside_hebrew_stays_readable)
{
    CHECK_EQ(Visual(kAlef + kBet + " WiFi " + kGimel), kGimel + " WiFi " + kBet + kAlef);
}

TEST(hebrew_word_inside_english_is_reversed_in_place)
{
    CHECK_EQ(Visual("Call " + kAlef + kBet + " at 5"), "Call " + kBet + kAlef + " at 5");
}

TEST(brackets_are_mirrored_in_hebrew)
{
    CHECK_EQ(Visual("(" + kAlef + kBet + ")"), "(" + kBet + kAlef + ")");
}

TEST(direction_follows_first_strong_character)
{
    CHECK(epaper_font::IsRightToLeft(kAlef + " abc"));
    CHECK(!epaper_font::IsRightToLeft("abc " + kAlef));
    CHECK(epaper_font::IsRightToLeft("12: " + kAlef));
    CHECK(!epaper_font::IsRightToLeft("12:30"));
}

TEST(right_to_left_mark_forces_direction_and_is_not_drawn)
{
    const std::string marked = std::string(epaper_font::kRightToLeftMarkUtf8) + "Google " + kAlef;
    CHECK(epaper_font::IsRightToLeft(marked));
    CHECK_EQ(Visual(marked), kAlef + " Google");
}

TEST(typographic_punctuation_becomes_ascii)
{
    CHECK_EQ(Visual("\xE2\x80\x9CHi\xE2\x80\x9D \xE2\x80\x94 ok\xE2\x80\xA6"),
             std::string("\"Hi\" - ok..."));
}

TEST(hebrew_vowel_points_are_dropped)
{
    // alef + qamats (U+05B8) + bet
    CHECK_EQ(Visual(kAlef + "\xD6\xB8" + kBet), kBet + kAlef);
}

TEST(truncated_utf8_does_not_produce_garbage)
{
    // Byte-wise ellipsis fitting can cut a two-byte letter in half; the half is ignored.
    std::vector<uint32_t> codepoints;
    epaper_font::DecodeForDisplay(kAlef + "\xD7", &codepoints);
    CHECK_EQ(codepoints.size(), static_cast<size_t>(1));
    epaper_font::DecodeForDisplay("\x91" + kAlef, &codepoints);  // stray continuation byte
    CHECK_EQ(codepoints.size(), static_cast<size_t>(1));
}
