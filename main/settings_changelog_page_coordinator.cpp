#include "settings_changelog_page_coordinator.h"

#include <utility>

#include "shared_page_interactions.h"

namespace {

using page_navigation::NavigationItemRole;

}  // namespace

SettingsChangelogPageCoordinator::SettingsChangelogPageCoordinator() = default;

void SettingsChangelogPageCoordinator::Show()
{
    scroll_container_active_ = false;
    scroll_position_percent_ = 0;
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(
                         NavigationItemRole::kSettingsChangelogScrollContainer));
}

bool SettingsChangelogPageCoordinator::MoveFocus(int delta)
{
    if (delta == 0) {
        return false;
    }
    if (scroll_container_active_) {
        const shared_page_interactions::ScrollStepResult step =
            shared_page_interactions::StepScrollPercent(scroll_position_percent_, delta,
                                                         scroll_step_percent_);
        if (!step.changed) {
            return false;
        }
        scroll_position_percent_ = step.value;
        return true;
    }
    return focus_.Move(delta);
}

bool SettingsChangelogPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool SettingsChangelogPageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

bool SettingsChangelogPageCoordinator::EnterScrollContainer()
{
    if (scroll_container_active_) {
        return false;
    }
    scroll_container_active_ = true;
    return true;
}

bool SettingsChangelogPageCoordinator::ExitScrollContainer()
{
    if (!scroll_container_active_) {
        return false;
    }
    scroll_container_active_ = false;
    return true;
}

void SettingsChangelogPageCoordinator::SetContent(std::string notes_text, std::string version_text)
{
    notes_text_ = std::move(notes_text);
    version_text_ = std::move(version_text);
}

epaper_ui::SettingsChangelogPageState SettingsChangelogPageCoordinator::BuildState() const
{
    epaper_ui::SettingsChangelogPageState state = {};
    state.navigation_focus_index = focus_.index();
    state.title_text = "Changelog";
    state.version_text = version_text_;
    state.scroll_container.content_text = notes_text_;
    state.scroll_container.empty_state_message = "No release notes in this build.";
    state.scroll_container.focused =
        IsRoleFocused(NavigationItemRole::kSettingsChangelogScrollContainer) ||
        scroll_container_active_;
    state.scroll_container.active = scroll_container_active_;
    state.scroll_container.scroll_position_percent = scroll_position_percent_;
    state.back = {
        .label_text = "Back",
        .selected = IsRoleFocused(NavigationItemRole::kSettingsChangelogBackButton),
    };
    return state;
}
