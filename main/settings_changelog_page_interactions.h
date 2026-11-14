#ifndef SETTINGS_CHANGELOG_PAGE_INTERACTIONS_H_
#define SETTINGS_CHANGELOG_PAGE_INTERACTIONS_H_

#include <cstdint>
#include <functional>

#include "page_action_result.h"
#include "settings_changelog_page_coordinator.h"

namespace settings_changelog_page_interactions {

enum class ActivateIntent : uint8_t {
    kNone = 0,
    kToggleScroll,
    kShowHome,
    kShowSettings,
    kShowWifi,
    kShowTime,
};

struct ActivateResult {
    ActivateIntent intent = ActivateIntent::kNone;
    bool handled = false;
    bool play_activate_cue = false;
};

using FocusMoveResult = page_actions::FocusMoveOutcome;

struct ActivateCallbacks {
    std::function<void()> toggle_scroll;
    std::function<void()> show_home;
    std::function<void()> show_settings;
    std::function<void()> show_wifi;
    std::function<void()> show_time;
};

ActivateResult HandlePrimaryActivate(const SettingsChangelogPageCoordinator& coordinator);
void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks);
FocusMoveResult HandleMoveFocus(SettingsChangelogPageCoordinator& coordinator, int delta);

}  // namespace settings_changelog_page_interactions

#endif  // SETTINGS_CHANGELOG_PAGE_INTERACTIONS_H_
