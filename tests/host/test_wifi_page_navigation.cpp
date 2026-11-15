// Wi-Fi page focus order with Wi-Fi on and off (page_navigation).
#include "check.h"
#include "page_navigation/navigation_model.h"

using page_navigation::BuildWifiPageNavigationModel;
using page_navigation::NavigationItemRole;

TEST(wifi_on_lists_every_control_in_order)
{
    const auto model = BuildWifiPageNavigationModel(true);
    const NavigationItemRole expected[] = {
        NavigationItemRole::kWifiPageWifiToggle,
        NavigationItemRole::kWifiPageEnableApToggle,
        NavigationItemRole::kWifiPageBatterySaverToggle,
        NavigationItemRole::kWifiPageNetworkList,
        NavigationItemRole::kWifiPagePasswordInput,
        NavigationItemRole::kWifiPagePasswordVisibilityButton,
        NavigationItemRole::kWifiPageScanButton,
        NavigationItemRole::kWifiPageConnectButton,
        NavigationItemRole::kWifiPageBackButton,
    };
    for (int index = 0; index < 9; ++index) {
        CHECK_EQ(model.IndexOfRole(expected[index]), index);
    }
}

TEST(wifi_off_skips_the_network_controls)
{
    const auto model = BuildWifiPageNavigationModel(false);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPageWifiToggle), 0);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPageBatterySaverToggle), 2);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPageBackButton), 3);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPageNetworkList), -1);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPagePasswordInput), -1);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPageScanButton), -1);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kWifiPageConnectButton), -1);
    CHECK(model.item_count < BuildWifiPageNavigationModel(true).item_count);
}

TEST(settings_silent_switch_sits_between_the_menu_and_manual)
{
    const auto model = page_navigation::BuildSettingsPageNavigationModel();
    const int about = model.IndexOfRole(NavigationItemRole::kSettingsMenuAbout);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kSettingsSilentToggle), about + 1);
    CHECK_EQ(model.IndexOfRole(NavigationItemRole::kSettingsManualOnboardingButton), about + 2);
}
