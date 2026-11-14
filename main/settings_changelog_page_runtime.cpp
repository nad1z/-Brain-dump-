#include "settings_changelog_page_runtime.h"

#include <cstring>
#include <mutex>
#include <string>
#include <string_view>

#include "changelog_text.h"
#include "esp_app_desc.h"

#include "page_navigation/navigation_model.h"
#include "page_navigation/page_focus_projection.h"
#include "settings_changelog_page_coordinator.h"
#include "settings_changelog_page_interactions.h"
#include "ui_refresh_runtime.h"

namespace settings_changelog_page_runtime {
namespace {

std::mutex s_mutex;
SettingsChangelogPageCoordinator s_coordinator = {};
bool s_content_loaded = false;

// CHANGELOG.md, embedded by main/CMakeLists.txt (EMBED_TXTFILES adds a terminating NUL).
extern "C" const char kChangelogStart[] asm("_binary_CHANGELOG_md_start");
extern "C" const char kChangelogEnd[] asm("_binary_CHANGELOG_md_end");

// The fork point: Brain Dump's own releases are everything after Chroninkle 1.0.0.
constexpr const char* kForkBaseVersion = "1.0.0";

// Builds the page text once; the embedded file never changes while running.
void LoadContentLocked()
{
    if (s_content_loaded) {
        return;
    }
    const size_t capacity = static_cast<size_t>(kChangelogEnd - kChangelogStart);
    const std::string_view markdown(kChangelogStart, strnlen(kChangelogStart, capacity));
    std::string version = "Installed: ";
    version += esp_app_get_description()->version;
    s_coordinator.SetContent(changelog_text::BuildDeviceChangelog(markdown, kForkBaseVersion),
                             version);
    s_content_loaded = true;
}

footer_runtime::FooterFocusItem FooterItemForSelectedIndex(int selected_index)
{
    switch (selected_index) {
        case 1:
            return footer_runtime::FooterFocusItem::kSettings;
        case 2:
            return footer_runtime::FooterFocusItem::kWifi;
        case 3:
            return footer_runtime::FooterFocusItem::kTime;
        case 0:
            return footer_runtime::FooterFocusItem::kHome;
        case 4:
            return footer_runtime::FooterFocusItem::kSticky;
        default:
            return footer_runtime::FooterFocusItem::kNone;
    }
}

page_navigation::NavigationItemRole FooterRoleForFooterItem(footer_runtime::FooterFocusItem item)
{
    switch (item) {
        case footer_runtime::FooterFocusItem::kSettings:
            return page_navigation::NavigationItemRole::kFooterSettings;
        case footer_runtime::FooterFocusItem::kWifi:
            return page_navigation::NavigationItemRole::kFooterWifi;
        case footer_runtime::FooterFocusItem::kHome:
            return page_navigation::NavigationItemRole::kFooterHome;
        case footer_runtime::FooterFocusItem::kTime:
            return page_navigation::NavigationItemRole::kFooterTime;
        case footer_runtime::FooterFocusItem::kSticky:
            return page_navigation::NavigationItemRole::kFooterSticky;
        case footer_runtime::FooterFocusItem::kNone:
        case footer_runtime::FooterFocusItem::kFolder:
        case footer_runtime::FooterFocusItem::kMic:
        default:
            return page_navigation::NavigationItemRole::kUnknown;
    }
}

footer_runtime::ProjectionState BuildFooterProjectionStateLocked()
{
    const page_navigation::PageFocusProjection projection = page_navigation::ProjectPageFocus(
        s_coordinator.navigation_model(), page_navigation::NavigationItemSection::kNone,
        s_coordinator.focus().index(), -1, -1);
    footer_runtime::ProjectionState state = {};
    state.focused_item = FooterItemForSelectedIndex(projection.footer_selected_index);
    return state;
}

bool FooterProjectionChangedForFocusIndexes(int old_focus_index, int new_focus_index)
{
    const page_navigation::PageFocusProjection old_projection = page_navigation::ProjectPageFocus(
        s_coordinator.navigation_model(), page_navigation::NavigationItemSection::kNone,
        old_focus_index, -1, -1);
    const page_navigation::PageFocusProjection new_projection = page_navigation::ProjectPageFocus(
        s_coordinator.navigation_model(), page_navigation::NavigationItemSection::kNone,
        new_focus_index, -1, -1);
    return FooterItemForSelectedIndex(old_projection.footer_selected_index) !=
           FooterItemForSelectedIndex(new_projection.footer_selected_index);
}

epaper_ui::SettingsChangelogPageState BuildStateLocked()
{
    return s_coordinator.BuildState();
}

}  // namespace

esp_err_t UpdateDisplayState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    LoadContentLocked();
    const epaper_ui::SettingsChangelogPageState state = BuildStateLocked();
    s_coordinator.SetScrollStepPercent(epaper_ui::SettingsChangelogScrollPageStepPercent(
        display_service::PortraitWidth(), display_service::PortraitHeight(), state));
    return display_service::SetSettingsChangelogPageState(state);
}

esp_err_t UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode refresh_mode)
{
    return UpdateDisplayStateAndRequestRefresh(
        display_service::RefreshRequest{.refresh_mode = refresh_mode});
}

esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request)
{
    return ui_refresh_runtime::Schedule(ui_refresh_runtime::SurfaceKey::kSettingsChangelogPage,
                                        &UpdateDisplayState, refresh_request);
}

page_actions::FocusMoveOutcome MoveFocus(int delta)
{
    page_actions::FocusMoveOutcome result = {};
    int old_focus_index = -1;
    int new_focus_index = -1;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        old_focus_index = s_coordinator.focus().index();
        result = settings_changelog_page_interactions::HandleMoveFocus(s_coordinator, delta);
        if (!result.handled) {
            return result;
        }
        new_focus_index = s_coordinator.focus().index();
    }

    result.sync_footer_projection =
        FooterProjectionChangedForFocusIndexes(old_focus_index, new_focus_index);
    return result;
}

settings_changelog_page_interactions::ActivateResult ActivateFocusedItem()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return settings_changelog_page_interactions::HandlePrimaryActivate(s_coordinator);
}

footer_runtime::ProjectionState BuildFooterProjectionState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return BuildFooterProjectionStateLocked();
}

page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item)
{
    page_actions::FocusUpdateOutcome result = {};
    const page_navigation::NavigationItemRole role = FooterRoleForFooterItem(item);
    if (role == page_navigation::NavigationItemRole::kUnknown) {
        return result;
    }

    int old_focus_index = -1;
    int new_focus_index = -1;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        const int focus_index = s_coordinator.navigation_model().IndexOfRole(role);
        if (focus_index < 0) {
            return result;
        }
        old_focus_index = s_coordinator.focus().index();
        if (!s_coordinator.SetFocusIndex(focus_index)) {
            return result;
        }
        new_focus_index = s_coordinator.focus().index();
    }

    result.handled = true;
    result.apply_page_state = true;
    result.sync_footer_projection =
        FooterProjectionChangedForFocusIndexes(old_focus_index, new_focus_index);
    return result;
}

void ToggleScroll()
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (!s_coordinator.ExitScrollContainer()) {
            (void)s_coordinator.EnterScrollContainer();
        }
    }
    (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
}

bool ExitActiveControl()
{
    bool exited = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        exited = s_coordinator.ExitScrollContainer();
    }
    if (exited) {
        (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
    }
    return exited;
}

void ResetFocus()
{
    footer_runtime::ProjectionState projection = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_coordinator.Show();
        projection = BuildFooterProjectionStateLocked();
    }
    footer_runtime::SetProjectionState(projection);
}

}  // namespace settings_changelog_page_runtime
