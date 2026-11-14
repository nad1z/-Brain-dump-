// Settings > Changelog text (main/changelog_text): CHANGELOG.md -> plain device text.
#include <string>

#include "changelog_text.h"
#include "check.h"

namespace {

constexpr const char* kSample =
    "# Changelog\n"
    "\n"
    "## [Unreleased]\n"
    "\n"
    "- Not shipped yet.\n"
    "\n"
    "## [1.10.0] - 2026-11-14\n"
    "\n"
    "### Added\n"
    "\n"
    "- **Press the rocker twice to go Home** from any screen (not while a menu\n"
    "  or the keyboard is open).\n"
    "- **Hold to capture.** Recording needs a hold \xE2\x80\x94 not a tap. More text here.\n"
    "\n"
    "### Fixed\n"
    "\n"
    "- A Select press released between 0.18 and 0.5 seconds was ignored, e.g. a slow\n"
    "  tap. It now counts. Second sentence.\n"
    "\n"
    "## [1.9.0] - 2026-11-01\n"
    "\n"
    "### Changed\n"
    "\n"
    "- Uses `braindump.bin` and [the manual](docs/user-manual.md).\n"
    "\n"
    "## [1.0.0] - 2026-09-24\n"
    "\n"
    "- Before the fork: must not appear.\n";

}  // namespace

TEST(changelog_lists_versions_after_the_fork_newest_first)
{
    const std::string text = changelog_text::BuildDeviceChangelog(kSample, "1.0.0");
    CHECK(text.find("Version 1.10.0 - 14 Nov 2026") == 0);
    CHECK(text.find("Version 1.9.0 - 1 Nov 2026") != std::string::npos);
    CHECK(text.find("Version 1.10.0") < text.find("Version 1.9.0"));
    CHECK(text.find("Before the fork") == std::string::npos);
    CHECK(text.find("Not shipped yet") == std::string::npos);
}

TEST(changelog_entries_are_title_and_first_sentence)
{
    const std::string text = changelog_text::BuildDeviceChangelog(kSample, "1.0.0");
    CHECK(text.find("- Press the rocker twice to go Home from any screen (not while a menu or "
                    "the keyboard is open).\n") != std::string::npos);
    CHECK(text.find("- Hold to capture: Recording needs a hold - not a tap.\n") !=
          std::string::npos);
    CHECK(text.find("More text here") == std::string::npos);
    // "e.g." does not end the sentence; "0.18" is not a sentence break either.
    CHECK(text.find("- A Select press released between 0.18 and 0.5 seconds was ignored, e.g. a "
                    "slow tap.\n") != std::string::npos);
}

TEST(changelog_strips_markdown_and_keeps_section_names)
{
    const std::string text = changelog_text::BuildDeviceChangelog(kSample, "1.0.0");
    CHECK(text.find("- Uses braindump.bin and the manual.") != std::string::npos);
    CHECK(text.find("Added\n") != std::string::npos);
    CHECK(text.find("Fixed\n") != std::string::npos);
    CHECK(text.find('*') == std::string::npos);
    CHECK(text.find('`') == std::string::npos);
    for (const char c : text) {
        CHECK(static_cast<unsigned char>(c) < 0x80);
    }
}

TEST(changelog_cut_off_is_numeric)
{
    const std::string text = changelog_text::BuildDeviceChangelog(kSample, "1.9.0");
    CHECK(text.find("Version 1.10.0") == 0);
    CHECK(text.find("Version 1.9.0") == std::string::npos);
}
