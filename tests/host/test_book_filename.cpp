// Book names from the setup page (components/text_reader_service/text_reader_book_filename).
#include <string>

#include "check.h"
#include "text_reader_book_filename.h"

using text_reader_service::SanitizeBookFilename;
using text_reader_service::UrlDecode;

TEST(book_filename_keeps_plain_names_and_forces_txt)
{
    CHECK_EQ(SanitizeBookFilename("Dracula.txt"), std::string("Dracula.txt"));
    CHECK_EQ(SanitizeBookFilename("Dracula.epub"), std::string("Dracula.txt"));
    CHECK_EQ(SanitizeBookFilename("Dracula.TXT"), std::string("Dracula.txt"));
    CHECK_EQ(SanitizeBookFilename("War & Peace (Vol. 1)"), std::string("War & Peace (Vol. 1).txt"));
}

TEST(book_filename_drops_folders_and_hidden_prefixes)
{
    CHECK_EQ(SanitizeBookFilename("../../secrets/notes.txt"), std::string("notes.txt"));
    CHECK_EQ(SanitizeBookFilename("C:\\books\\Emma.txt"), std::string("Emma.txt"));
    CHECK_EQ(SanitizeBookFilename("._Dracula.txt"), std::string("_Dracula.txt"));
}

TEST(book_filename_replaces_unsupported_characters)
{
    CHECK_EQ(SanitizeBookFilename("a:b*c?d"), std::string("a b c d.txt"));
    CHECK_EQ(SanitizeBookFilename("  spaced   out  .txt"), std::string("spaced out.txt"));
    // Hebrew (UTF-8) cannot be stored in the card's CP437 names.
    CHECK_EQ(SanitizeBookFilename("\xD7\xA1\xD7\xA4\xD7\xA8.epub"), std::string("book.txt"));
    CHECK_EQ(SanitizeBookFilename("Notes \xD7\xA1\xD7\xA4\xD7\xA8 2"), std::string("Notes 2.txt"));
    CHECK_EQ(SanitizeBookFilename(""), std::string("book.txt"));
}

TEST(book_filename_limits_length)
{
    const std::string long_name(200, 'a');
    const std::string result = SanitizeBookFilename(long_name);
    CHECK_EQ(result.size(), static_cast<size_t>(84));
    CHECK(result.rfind(".txt") == 80);
}

TEST(url_decode_handles_escapes_and_plus)
{
    CHECK_EQ(UrlDecode("War%20%26%20Peace+1.txt"), std::string("War & Peace 1.txt"));
    CHECK_EQ(UrlDecode("100%"), std::string("100%"));
    CHECK_EQ(UrlDecode("%zz"), std::string("%zz"));
}
