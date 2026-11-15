// Share over WiFi: file-name and request helpers (components/share_service/share_names).
#include <string>

#include "check.h"
#include "share_names.h"

using share_service::IsValidRecordingId;
using share_service::PinFromRandom;
using share_service::SanitizeBookName;
using share_service::UrlDecode;

TEST(url_decoding_handles_escapes_plus_and_bad_input)
{
    CHECK_EQ(UrlDecode("My%20Book.txt"), std::string("My Book.txt"));
    CHECK_EQ(UrlDecode("a+b"), std::string("a b"));
    CHECK_EQ(UrlDecode("%D7%A9%D7%9C%D7%95%D7%9D"), std::string("\xD7\xA9\xD7\x9C\xD7\x95\xD7\x9D"));
    CHECK_EQ(UrlDecode("100%"), std::string("100%"));
    CHECK_EQ(UrlDecode("%zz"), std::string("%zz"));
}

TEST(book_names_are_flattened_and_made_txt)
{
    CHECK_EQ(SanitizeBookName("Dune.epub"), std::string("Dune.txt"));
    CHECK_EQ(SanitizeBookName("notes.TXT"), std::string("notes.txt"));
    CHECK_EQ(SanitizeBookName("Plain"), std::string("Plain.txt"));
    CHECK_EQ(SanitizeBookName("C:\\Users\\me\\Book.txt"), std::string("Book.txt"));
    CHECK_EQ(SanitizeBookName("../../etc/passwd"), std::string("passwd.txt"));
    CHECK_EQ(SanitizeBookName("What? A <title>: 2*"), std::string("What_ A _title__ 2_.txt"));
}

TEST(book_names_that_are_unusable_are_rejected)
{
    CHECK(SanitizeBookName("").empty());
    CHECK(SanitizeBookName("..").empty());
    CHECK(SanitizeBookName(".txt").empty());
    CHECK(SanitizeBookName("   ").empty());
    CHECK(SanitizeBookName("folder/").empty());
}

TEST(hidden_and_trailing_dots_are_removed)
{
    CHECK_EQ(SanitizeBookName(".hidden.txt"), std::string("hidden.txt"));
    CHECK_EQ(SanitizeBookName("Title. .txt"), std::string("Title.txt"));
}

TEST(hebrew_book_names_are_kept_and_cut_on_a_character_boundary)
{
    const std::string shalom = "\xD7\xA9\xD7\x9C\xD7\x95\xD7\x9D";
    CHECK_EQ(SanitizeBookName(shalom + ".epub"), shalom + ".txt");
    std::string long_name;
    for (int i = 0; i < 40; ++i) {
        long_name += shalom;  // 8 bytes each, 320 bytes total
    }
    const std::string cut = SanitizeBookName(long_name);
    CHECK(cut.size() <= 104);
    // Every Hebrew letter is two bytes, so a clean cut leaves an even-length stem.
    CHECK_EQ((cut.size() - 4) % 2, static_cast<size_t>(0));
}

TEST(recording_ids_are_validated)
{
    CHECK(IsValidRecordingId("20261114_170500"));
    CHECK(IsValidRecordingId("rec-1"));
    CHECK(!IsValidRecordingId(""));
    CHECK(!IsValidRecordingId("../secret"));
    CHECK(!IsValidRecordingId("a b"));
    CHECK(!IsValidRecordingId(std::string(65, 'a')));
}

TEST(pins_are_four_digits)
{
    CHECK_EQ(PinFromRandom(7), std::string("0007"));
    CHECK_EQ(PinFromRandom(123456), std::string("3456"));
    CHECK_EQ(PinFromRandom(0xFFFFFFFFu).size(), static_cast<size_t>(4));
}
