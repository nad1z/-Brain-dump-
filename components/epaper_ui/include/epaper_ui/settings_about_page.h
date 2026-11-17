#ifndef EPAPER_UI_SETTINGS_ABOUT_PAGE_H_
#define EPAPER_UI_SETTINGS_ABOUT_PAGE_H_

#include <cstdint>
#include <string>
#include <string_view>

#include "epaper_ui/button.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

enum class SettingsAboutPageItemId : uint8_t {
    kNone = 0,
    kUpdate,
    kBack,
};

struct SettingsAboutPageState {
    int navigation_focus_index = -1;
    std::string_view title_text = "About";
    // e.g. "Version 0.7.0" -- built at BuildState() time from esp_app_get_description().
    std::string version_text;
    // Software update: one or two wrapped lines of status ("You have the latest version.",
    // an error, ...) under the version, then the update button. Owned strings (not
    // string_views) because both change at runtime and the state is copied into the renderer.
    std::string update_status_text;
    std::string update_button_label = "Check for updates";
    bool update_button_selected = false;
    std::string_view acknowledgment_text =
        "Brain Dump is a fork of Chroninkle, which began as a fork of Followup, created by "
        "ALXV Labs. Thank you to both for the design and implementation this project builds on.";
    ButtonState back = {};
};

UiRect SettingsAboutPageItemBounds(int portrait_width,
                                   int portrait_height,
                                   const SettingsAboutPageState& state,
                                   SettingsAboutPageItemId item);
bool HitTestSettingsAboutPageItem(int portrait_width,
                                  int portrait_height,
                                  const SettingsAboutPageState& state,
                                  int x,
                                  int y,
                                  SettingsAboutPageItemId* item);
void DrawSettingsAboutPage(uint8_t* framebuffer,
                           int raw_width,
                           int raw_height,
                           int portrait_width,
                           int portrait_height,
                           const SettingsAboutPageState& state,
                           const StatusBarState& status_bar_state,
                           const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_SETTINGS_ABOUT_PAGE_H_
