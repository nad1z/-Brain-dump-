#include "settings_about_page_interactions.h"

namespace settings_about_page_interactions {
namespace {

using page_navigation::NavigationItemRole;

}  // namespace

ActivateResult HandlePrimaryActivate(const SettingsAboutPageCoordinator& coordinator)
{
    ActivateResult result = {};

    if (coordinator.IsRoleFocused(NavigationItemRole::kSettingsAboutUpdateButton)) {
        result.handled = true;
        switch (coordinator.CurrentUpdateAction()) {
            case SettingsAboutPageCoordinator::UpdateAction::kCheck:
                result.play_activate_cue = true;
                result.intent = ActivateIntent::kCheckForUpdates;
                break;
            case SettingsAboutPageCoordinator::UpdateAction::kInstall:
                result.play_activate_cue = true;
                result.intent = ActivateIntent::kInstallUpdate;
                break;
            case SettingsAboutPageCoordinator::UpdateAction::kNone:
            default:
                // A check or download is already running: the press is swallowed.
                break;
        }
        return result;
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kSettingsAboutBackButton)) {
        // Returns to the Settings hub -- this page is only ever reached from there, so there's
        // no other source to track.
        result.handled = true;
        result.play_activate_cue = true;
        result.intent = ActivateIntent::kShowSettings;
        return result;
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kFooterHome)) {
        result.handled = true;
        result.play_activate_cue = true;
        result.intent = ActivateIntent::kShowHome;
        return result;
    }

    return result;
}

void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks)
{
    switch (result.intent) {
        case ActivateIntent::kShowHome:
            if (callbacks.show_home) {
                callbacks.show_home();
            }
            break;
        case ActivateIntent::kShowSettings:
            if (callbacks.show_settings) {
                callbacks.show_settings();
            }
            break;
        case ActivateIntent::kCheckForUpdates:
            if (callbacks.check_for_updates) {
                callbacks.check_for_updates();
            }
            break;
        case ActivateIntent::kInstallUpdate:
            if (callbacks.install_update) {
                callbacks.install_update();
            }
            break;
        case ActivateIntent::kNone:
        default:
            break;
    }
}

FocusMoveResult HandleMoveFocus(SettingsAboutPageCoordinator& coordinator, int delta)
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

}  // namespace settings_about_page_interactions
