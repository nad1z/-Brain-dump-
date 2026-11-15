#ifndef SHARE_NAMES_H_
#define SHARE_NAMES_H_

#include <string>

// Pure helpers for share_service's HTTP routes: no ESP-IDF calls, host-tested in tests/host.
namespace share_service {

// Decodes %XX escapes and '+' (as sent in a URL query string). Invalid escapes are kept as-is.
std::string UrlDecode(const std::string& value);

// Turns an uploaded file name into a safe name for the flat books folder: keeps only the base
// name, drops characters FAT cannot store or that could escape the folder, and forces a ".txt"
// extension (an ".epub" upload has already been converted to text by the web page). Returns an
// empty string when nothing usable is left.
std::string SanitizeBookName(const std::string& name);

// True for a recording id as the archive creates them: 1..64 of [A-Za-z0-9_-].
bool IsValidRecordingId(const std::string& id);

// Four decimal digits, zero-padded, from any 32-bit value (e.g. a hardware random number).
std::string PinFromRandom(uint32_t random_value);

}  // namespace share_service

#endif  // SHARE_NAMES_H_
