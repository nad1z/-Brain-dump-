#ifndef TEXT_READER_BOOK_FILENAME_H_
#define TEXT_READER_BOOK_FILENAME_H_

#include <string>
#include <string_view>

namespace text_reader_service {

// Turns a name sent by the setup page ("Dracula.epub", "../War & Peace.txt", a Hebrew title)
// into a safe file name for the books folder: no folders, only characters the SD card's
// code page (CP437, so plain ASCII here) can store, at most 80 characters before ".txt",
// always ending in ".txt". Letters, digits and  - _ . ( ) , ' & !  and spaces are kept;
// anything else becomes a single space. Returns "book.txt" when nothing usable is left (for
// example an all-Hebrew title).
std::string SanitizeBookFilename(std::string_view requested);

// Decodes %XX and '+' from a URL query value.
std::string UrlDecode(std::string_view value);

}  // namespace text_reader_service

#endif  // TEXT_READER_BOOK_FILENAME_H_
