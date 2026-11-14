#include "settings_changelog_page_interactions.h"

namespace settings_changelog_page_interactions {
namespace {

using page_navigation::NavigationItemRole;

ActivateResult Intent(ActivateIntent intent)
{
    ActivateResult result = {};
    result.handled = true;
    result.play_activate_cue = true;
    result.intent = intent;
    return result;
}

}  // namespace

ActivateResult HandlePrimaryActivate(const SettingsChangelogPageCoordinator& coordinator)
{
    if (coordinator.scroll_container_active() ||
        coordinator.IsRoleFocused(NavigationItemRole::kSettingsChangelogScrollContainer)) {
        return Intent(ActivateIntent::kToggleScroll);
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kSettingsChangelogBackButton)) {
        // Returns to the Settings hub -- the only way onto this page.
        return Intent(ActivateIntent::kShowSettings);
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kFooterHome)) {
        return Intent(ActivateIntent::kShowHome);
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kFooterSettings)) {
        return Intent(ActivateIntent::kShowSettings);
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kFooterWifi)) {
        return Intent(ActivateIntent::kShowWifi);
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kFooterTime)) {
        return Intent(ActivateIntent::kShowTime);
    }
    return {};
}

void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks)
{
    const std::function<void()>* callback = nullptr;
    switch (result.intent) {
        case ActivateIntent::kToggleScroll:
            callback = &callbacks.toggle_scroll;
            break;
        case ActivateIntent::kShowHome:
            callback = &callbacks.show_home;
            break;
        case ActivateIntent::kShowSettings:
            callback = &callbacks.show_settings;
            break;
        case ActivateIntent::kShowWifi:
            callback = &callbacks.show_wifi;
            break;
        case ActivateIntent::kShowTime:
            callback = &callbacks.show_time;
            break;
        case ActivateIntent::kNone:
        default:
            break;
    }
    if (callback != nullptr && *callback) {
        (*callback)();
    }
}

FocusMoveResult HandleMoveFocus(SettingsChangelogPageCoordinator& coordinator, int delta)
{
    FocusMoveResult result = {};
    if (!coordinator.MoveFocus(delta)) {
        return result;
    }
    result.handled = true;
    result.play_navigation_cue = true;
    result.apply_page_state = true;
    return result;
}

}  // namespace settings_changelog_page_interactions
