#ifndef SETTINGS_CHANGELOG_PAGE_RUNTIME_H_
#define SETTINGS_CHANGELOG_PAGE_RUNTIME_H_

#include "app_interaction_target.h"
#include "display_service.h"
#include "esp_err.h"
#include "footer_runtime.h"
#include "page_action_result.h"
#include "settings_changelog_page_interactions.h"

namespace settings_changelog_page_runtime {

esp_err_t UpdateDisplayState();
esp_err_t UpdateDisplayStateAndRequestRefresh(
    display_service::RefreshMode refresh_mode = display_service::RefreshMode::kPartial);
esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request);
page_actions::FocusMoveOutcome MoveFocus(int delta);
settings_changelog_page_interactions::ActivateResult ActivateFocusedItem();

footer_runtime::ProjectionState BuildFooterProjectionState();
page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item);
void ResetFocus();

// Select on the release notes enters them (UP/DOWN page through); Select again leaves.
void ToggleScroll();
// Back gesture: leaves the entered notes. Returns false when they were not entered.
bool ExitActiveControl();

}  // namespace settings_changelog_page_runtime

#endif  // SETTINGS_CHANGELOG_PAGE_RUNTIME_H_
