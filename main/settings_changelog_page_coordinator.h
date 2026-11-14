#ifndef SETTINGS_CHANGELOG_PAGE_COORDINATOR_H_
#define SETTINGS_CHANGELOG_PAGE_COORDINATOR_H_

#include <string>

#include "epaper_ui/settings_changelog_page.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/roving_focus.h"

// Settings > Changelog: release notes in a scroll container plus a Back button. Focus roves
// scroll/back/footer; Select on the notes enters them so UP/DOWN page through, and Back (or
// Select again) leaves.
class SettingsChangelogPageCoordinator {
public:
    SettingsChangelogPageCoordinator();

    void Show();
    bool MoveFocus(int delta);
    bool SetFocusIndex(int index);
    bool IsRoleFocused(page_navigation::NavigationItemRole role) const;

    bool EnterScrollContainer();
    bool ExitScrollContainer();
    bool scroll_container_active() const { return scroll_container_active_; }
    void SetScrollStepPercent(int percent) { scroll_step_percent_ = percent; }

    void SetContent(std::string notes_text, std::string version_text);
    epaper_ui::SettingsChangelogPageState BuildState() const;

    const page_navigation::NavigationModel& navigation_model() const { return navigation_model_; }
    const page_navigation::RovingFocus& focus() const { return focus_; }

private:
    page_navigation::NavigationModel navigation_model_ =
        page_navigation::BuildSettingsChangelogPageNavigationModel();
    page_navigation::RovingFocus focus_{navigation_model_.item_count, 0};
    bool scroll_container_active_ = false;
    int scroll_position_percent_ = 0;
    int scroll_step_percent_ = 10;
    std::string notes_text_ = {};
    std::string version_text_ = {};
};

#endif  // SETTINGS_CHANGELOG_PAGE_COORDINATOR_H_
