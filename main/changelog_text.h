#ifndef CHANGELOG_TEXT_H_
#define CHANGELOG_TEXT_H_

#include <string>
#include <string_view>

namespace changelog_text {

// Turns CHANGELOG.md (Keep a Changelog format) into the plain text the Settings > Changelog
// page shows: every released version newer than `after_version`, newest first, as
//
//   Version 1.8.0 - 14 Nov 2026
//   Added
//   - Press the rocker twice to go Home from any screen ...
//
// Each entry is its bold title plus the first sentence that follows it, joined by ": " (or by
// a space when the title runs on into a lowercase continuation), or just its first sentence
// when it has no bold title. Markdown markup is removed and the few non-ASCII
// characters the changelog uses (dashes, arrows, curly quotes) become ASCII, because the
// device fonts are ASCII plus Hebrew. "[Unreleased]" is skipped.
std::string BuildDeviceChangelog(std::string_view markdown, std::string_view after_version);

}  // namespace changelog_text

#endif  // CHANGELOG_TEXT_H_
