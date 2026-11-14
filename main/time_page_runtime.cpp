#include "time_page_runtime.h"

#include <climits>
#include <mutex>

#include "epaper_ui/time_page.h"
#include "esp_log.h"
#include "overlay_runtime.h"
#include "page_navigation/page_focus_projection.h"
#include "project_assets.h"
#include "time_page_coordinator.h"
#include "timezone_service.h"
#include "ui_refresh_runtime.h"

namespace time_page_runtime {
namespace {

constexpr const char* kTag = "TimePageRuntime";

std::mutex s_mutex;
TimePageCoordinator s_coordinator = {};
int32_t s_interaction_generation = 1;
bool s_timezone_modal_active = false;

void AdvanceInteractionGenerationLocked()
{
    if (s_interaction_generation == INT32_MAX) {
        s_interaction_generation = 1;
    } else {
        ++s_interaction_generation;
    }
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

epaper_ui::TimePageState BuildStateLocked()
{
    return s_coordinator.BuildState();
}

footer_runtime::ProjectionState BuildFooterProjectionStateLocked()
{
    const page_navigation::PageFocusProjection projection =
        page_navigation::ProjectPageFocus(s_coordinator.navigation_model(),
                                          page_navigation::NavigationItemSection::kTimePageControls,
                                          s_coordinator.focus().index(),
                                          -1,
                                          -1);
    footer_runtime::ProjectionState state = {};
    state.focused_item = FooterItemForSelectedIndex(projection.footer_selected_index);
    return state;
}

bool FooterProjectionChangedForFocusIndexes(int old_focus_index, int new_focus_index)
{
    const page_navigation::PageFocusProjection old_projection =
        page_navigation::ProjectPageFocus(s_coordinator.navigation_model(),
                                          page_navigation::NavigationItemSection::kTimePageControls,
                                          old_focus_index, -1, -1);
    const page_navigation::PageFocusProjection new_projection =
        page_navigation::ProjectPageFocus(s_coordinator.navigation_model(),
                                          page_navigation::NavigationItemSection::kTimePageControls,
                                          new_focus_index, -1, -1);
    return FooterItemForSelectedIndex(old_projection.footer_selected_index) !=
           FooterItemForSelectedIndex(new_projection.footer_selected_index);
}

}  // namespace

esp_err_t UpdateDisplayState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return display_service::SetTimePageState(BuildStateLocked());
}

esp_err_t UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode refresh_mode)
{
    return UpdateDisplayStateAndRequestRefresh(display_service::RefreshRequest{
        .refresh_mode = refresh_mode,
    });
}

esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request)
{
    return ui_refresh_runtime::Schedule(ui_refresh_runtime::SurfaceKey::kTimePage,
                                        &UpdateDisplayState, refresh_request);
}

page_actions::FocusMoveOutcome MoveFocus(int delta, bool repeat)
{
    page_actions::FocusMoveOutcome result = {};
    int old_focus_index = -1;
    int new_focus_index = -1;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        old_focus_index = s_coordinator.focus().index();
        result = time_page_interactions::HandleMoveFocus(s_coordinator, delta, repeat);
        if (!result.handled) {
            return result;
        }
        new_focus_index = s_coordinator.focus().index();
    }
    result.sync_footer_projection =
        FooterProjectionChangedForFocusIndexes(old_focus_index, new_focus_index);
    return result;
}

time_page_interactions::ActivateResult ActivateFocusedItem()
{
    time_page_interactions::ActivateResult result = {};
    bool committed = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        // Select while a field is being changed keeps the new value and leaves edit mode.
        committed = s_coordinator.CommitEdit();
        if (!committed) {
            return time_page_interactions::HandlePrimaryActivate(s_coordinator);
        }
    }
    (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
    result.handled = true;
    result.play_activate_cue = true;
    return result;
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

void ResetFocus()
{
    footer_runtime::ProjectionState projection = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_coordinator.PrepareForShow();
        AdvanceInteractionGenerationLocked();
        projection = BuildFooterProjectionStateLocked();
    }
    footer_runtime::SetProjectionState(projection);
}

esp_err_t SyncFromService(bool request_refresh_if_active)
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_coordinator.RefreshFromService(timezone_service::GetSnapshot(),
                                         timezone_service::ListTimezones());
    }
    const esp_err_t err =
        request_refresh_if_active
            ? UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial)
            : UpdateDisplayState();
    if (err != ESP_OK && err != ESP_ERR_INVALID_STATE) {
        ESP_LOGW(kTag, "Time page sync failed: %s", esp_err_to_name(err));
    }
    return err;
}

void ToggleMeridiem()
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_coordinator.ToggleMeridiem();
    }
    (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
}

esp_err_t Save()
{
    timezone_service::SettingsPatch patch = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        patch = s_coordinator.BuildSettingsPatch();
        s_coordinator.MarkSaved();
    }
    // ApplySettingsPatch's internal Notify drives HandleTimezoneEvent, which already
    // re-syncs and refreshes the time page. Don't also call SyncFromService here — a second
    // full sync (ListTimezones + state build) on the small touch task stack was part of the
    // pressure behind the Save stack overflow.
    const timezone_service::Result result = timezone_service::ApplySettingsPatch(patch);
    if (!result.success) {
        ESP_LOGW(kTag, "Save failed: field=%s message=%s", result.field.c_str(),
                 result.message.c_str());
    }

    epaper_ui::ToastState toast = {};
    toast.visible = true;
    toast.body_text = result.success ? "Time saved" : "Couldn't save time";
    toast.leading_icon = project_assets::GetIcon(EmbeddedIconId::kTime);
    (void)overlay_runtime::ShowToastForDuration(toast, 2000);
    return result.success ? ESP_OK : ESP_FAIL;
}

esp_err_t ShowTimezoneModal()
{
    epaper_ui::SelectModalState state = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        state.visible = true;
        state.title_text = "Select timezone";
        const int selected = s_coordinator.SelectedTimezoneIndex();
        state.selected_index = selected < 0 ? 0 : selected;
        for (const timezone_service::TimezoneInfo& tz : s_coordinator.timezones()) {
            state.items.push_back({
                .label_text = tz.description.empty() ? tz.name : tz.description,
            });
        }
        s_timezone_modal_active = true;
    }
    return overlay_runtime::ShowSelectModal(state);
}

esp_err_t BeginFieldEdit(page_navigation::NavigationItemRole field)
{
    bool began = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        began = s_coordinator.BeginEdit(field);
    }
    if (!began) {
        return ESP_OK;
    }
    return UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
}

bool ExitActiveControl()
{
    bool cancelled = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        cancelled = s_coordinator.CancelEdit();
    }
    if (cancelled) {
        (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
    }
    return cancelled;
}

bool HandleSelectModalSubmit(int selected_index)
{
    bool was_active = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        was_active = s_timezone_modal_active;
        s_timezone_modal_active = false;
        if (was_active) {
            s_coordinator.SetTimezoneByIndex(selected_index);
        }
    }
    if (was_active) {
        (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kPartial);
    }
    return was_active;
}

void ClearPendingSelectModal()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_timezone_modal_active = false;
}

}  // namespace time_page_runtime
