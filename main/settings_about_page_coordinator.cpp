#include "settings_about_page_coordinator.h"

#include <cstdio>
#include <string>

#include "esp_app_desc.h"
#include "firmware_update_service.h"

namespace {

using firmware_update_service::CloudState;
using firmware_update_service::CloudStatus;

std::string UpdateButtonLabel(const CloudStatus& status)
{
    switch (status.state) {
        case CloudState::kChecking:
            return "Checking...";
        case CloudState::kAvailable:
            return "Install version " + status.latest_version;
        case CloudState::kDownloading:
            return "Downloading... " + std::to_string(status.progress_percent) + "%";
        case CloudState::kRestarting:
            return "Restarting...";
        case CloudState::kIdle:
        case CloudState::kUpToDate:
        case CloudState::kError:
        default:
            return "Check for updates";
    }
}

std::string UpdateStatusText(const CloudStatus& status)
{
    switch (status.state) {
        case CloudState::kChecking:
            return "Looking for a newer version...";
        case CloudState::kUpToDate:
            return "You have the latest version.";
        case CloudState::kAvailable:
            return "Version " + status.latest_version +
                   " is available. It downloads over Wi-Fi and the device restarts by itself.";
        case CloudState::kDownloading:
            return "Keep the device on. It restarts by itself when the update is installed.";
        case CloudState::kRestarting:
            return "Update installed. Restarting...";
        case CloudState::kError:
            return status.message;
        case CloudState::kIdle:
        default:
            return {};
    }
}

}  // namespace

SettingsAboutPageCoordinator::SettingsAboutPageCoordinator() = default;

void SettingsAboutPageCoordinator::Show()
{
    focus_.Configure(navigation_model_.item_count, 0);
}

bool SettingsAboutPageCoordinator::MoveFocus(int delta)
{
    return focus_.Move(delta);
}

bool SettingsAboutPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool SettingsAboutPageCoordinator::IsRoleFocused(page_navigation::NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

SettingsAboutPageCoordinator::UpdateAction SettingsAboutPageCoordinator::CurrentUpdateAction() const
{
    if (firmware_update_service::IsCloudWorkInFlight() ||
        firmware_update_service::IsUpdateInProgress()) {
        return UpdateAction::kNone;
    }
    const CloudStatus status = firmware_update_service::GetCloudStatus();
    switch (status.state) {
        case CloudState::kAvailable:
            return UpdateAction::kInstall;
        case CloudState::kChecking:
        case CloudState::kDownloading:
        case CloudState::kRestarting:
            return UpdateAction::kNone;
        case CloudState::kIdle:
        case CloudState::kUpToDate:
        case CloudState::kError:
        default:
            return UpdateAction::kCheck;
    }
}

epaper_ui::SettingsAboutPageState SettingsAboutPageCoordinator::BuildState() const
{
    epaper_ui::SettingsAboutPageState state = {};
    state.navigation_focus_index = focus_.index();

    // esp_app_desc_t::version is itself a fixed 32-byte field, so "Version " (8 bytes) + that
    // + a null terminator needs more than 32 bytes of headroom to avoid a format-truncation
    // warning (treated as an error by this project's build flags).
    char version_buffer[48] = {};
    std::snprintf(version_buffer, sizeof(version_buffer), "Version %s",
                 esp_app_get_description()->version);
    state.version_text = version_buffer;

    const CloudStatus update = firmware_update_service::GetCloudStatus();
    state.update_status_text = UpdateStatusText(update);
    state.update_button_label = UpdateButtonLabel(update);
    state.update_button_selected =
        IsRoleFocused(page_navigation::NavigationItemRole::kSettingsAboutUpdateButton);

    state.back = {
        .label_text = "Back",
        .selected =
            IsRoleFocused(page_navigation::NavigationItemRole::kSettingsAboutBackButton),
    };
    return state;
}
