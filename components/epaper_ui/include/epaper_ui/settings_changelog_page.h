#ifndef EPAPER_UI_SETTINGS_CHANGELOG_PAGE_H_
#define EPAPER_UI_SETTINGS_CHANGELOG_PAGE_H_

#include <cstdint>
#include <string>

#include "epaper_ui/button.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/scroll_container.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

// Settings > Changelog: a title, the release notes in a scroll container (select it, then
// tilt to page through), and a Back button.
struct SettingsChangelogPageState {
    int navigation_focus_index = -1;
    std::string title_text = "Changelog";
    // e.g. "Installed: 1.9.0"
    std::string version_text = {};
    ScrollContainerState scroll_container = {};
    ButtonState back = {};

    bool operator==(const SettingsChangelogPageState& other) const = default;
};

// Scroll step (percent) that pages the notes by one screenful; see
// ScrollContainerPageStepPercent.
int SettingsChangelogScrollPageStepPercent(int portrait_width,
                                           int portrait_height,
                                           const SettingsChangelogPageState& state);
void DrawSettingsChangelogPage(uint8_t* framebuffer,
                               int raw_width,
                               int raw_height,
                               int portrait_width,
                               int portrait_height,
                               const SettingsChangelogPageState& state,
                               const StatusBarState& status_bar_state,
                               const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_SETTINGS_CHANGELOG_PAGE_H_
