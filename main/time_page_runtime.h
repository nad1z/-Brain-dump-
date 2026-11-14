#ifndef TIME_PAGE_RUNTIME_H_
#define TIME_PAGE_RUNTIME_H_

#include "app_interaction_target.h"
#include "display_service.h"
#include "esp_err.h"
#include "footer_runtime.h"
#include "page_action_result.h"
#include "page_navigation/navigation_model.h"
#include "time_page_interactions.h"

namespace time_page_runtime {

esp_err_t UpdateDisplayState();
esp_err_t UpdateDisplayStateAndRequestRefresh(
    display_service::RefreshMode refresh_mode = display_service::RefreshMode::kPartial);
esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request);
page_actions::FocusMoveOutcome MoveFocus(int delta, bool repeat = false);
time_page_interactions::ActivateResult ActivateFocusedItem();

footer_runtime::ProjectionState BuildFooterProjectionState();
page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item);
void ResetFocus();
esp_err_t SyncFromService(bool request_refresh_if_active);

// Field activations (invoked by the page-input activate callbacks).
void ToggleMeridiem();
esp_err_t Save();
esp_err_t ShowTimezoneModal();
// Starts changing a numeric field with the rocker (see TimePageCoordinator::BeginEdit).
esp_err_t BeginFieldEdit(page_navigation::NavigationItemRole field);
// Back gesture: cancels a field edit in progress, restoring its old value. Returns false when
// nothing was being edited, so the gesture falls through to its normal meaning.
bool ExitActiveControl();

// Routes a select-modal submission to the timezone field when the timezone modal is the
// one currently open. Returns true if it consumed the submission. Cleared by
// ClearPendingSelectModal when another select modal takes over.
bool HandleSelectModalSubmit(int selected_index);
void ClearPendingSelectModal();

}  // namespace time_page_runtime

#endif  // TIME_PAGE_RUNTIME_H_
