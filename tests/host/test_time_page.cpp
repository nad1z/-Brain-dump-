// 24-hour clock: the Time page's AM -> PM -> 24H button (main/time_page_coordinator).
#include <string>

#include "check.h"
#include "time_page_coordinator.h"

namespace {

timezone_service::Snapshot SnapshotAt(const std::string& time24, bool use_24_hour)
{
    timezone_service::Snapshot snapshot = {};
    snapshot.settings.timezone_name = "Asia/Jerusalem";
    snapshot.settings.use_24_hour = use_24_hour;
    snapshot.runtime.current_date = "2026-11-14";
    snapshot.runtime.current_time = time24;
    return snapshot;
}

TimePageCoordinator CoordinatorAt(const std::string& time24, bool use_24_hour)
{
    TimePageCoordinator coordinator;
    coordinator.RefreshFromService(SnapshotAt(time24, use_24_hour), {});
    return coordinator;
}

}  // namespace

TEST(twelve_hour_mode_shows_pm_and_twelve_hour_digits)
{
    const TimePageCoordinator coordinator = CoordinatorAt("17:05", false);
    CHECK_EQ(coordinator.hour(), std::string("05"));
    CHECK_EQ(coordinator.BuildState().meridiem.label_text, std::string("PM"));
    const timezone_service::SettingsPatch patch = coordinator.BuildSettingsPatch();
    CHECK_EQ(patch.manual_time, std::string("17:05"));
    CHECK(patch.has_use_24_hour && !patch.use_24_hour);
}

TEST(twenty_four_hour_mode_shows_24h_and_full_hour)
{
    const TimePageCoordinator coordinator = CoordinatorAt("17:05", true);
    CHECK_EQ(coordinator.hour(), std::string("17"));
    CHECK_EQ(coordinator.BuildState().meridiem.label_text, std::string("24H"));
    const timezone_service::SettingsPatch patch = coordinator.BuildSettingsPatch();
    CHECK_EQ(patch.manual_time, std::string("17:05"));
    CHECK(patch.has_use_24_hour && patch.use_24_hour);
}

TEST(button_cycles_am_pm_24h_and_back)
{
    TimePageCoordinator coordinator = CoordinatorAt("09:30", false);
    CHECK_EQ(coordinator.BuildState().meridiem.label_text, std::string("AM"));

    coordinator.ToggleMeridiem();  // AM -> PM: same digits, twelve hours later
    CHECK_EQ(coordinator.BuildState().meridiem.label_text, std::string("PM"));
    CHECK_EQ(coordinator.BuildSettingsPatch().manual_time, std::string("21:30"));

    coordinator.ToggleMeridiem();  // PM -> 24H: same moment, digits converted
    CHECK_EQ(coordinator.BuildState().meridiem.label_text, std::string("24H"));
    CHECK_EQ(coordinator.hour(), std::string("21"));
    CHECK_EQ(coordinator.BuildSettingsPatch().manual_time, std::string("21:30"));
    CHECK(coordinator.BuildSettingsPatch().use_24_hour);

    coordinator.ToggleMeridiem();  // 24H -> AM: twelve-hour digits again
    CHECK_EQ(coordinator.BuildState().meridiem.label_text, std::string("AM"));
    CHECK_EQ(coordinator.hour(), std::string("09"));
    CHECK(!coordinator.BuildSettingsPatch().use_24_hour);
}

TEST(midnight_and_noon_convert_correctly)
{
    CHECK_EQ(CoordinatorAt("00:10", false).hour(), std::string("12"));
    CHECK_EQ(CoordinatorAt("00:10", false).BuildSettingsPatch().manual_time, std::string("00:10"));
    CHECK_EQ(CoordinatorAt("12:10", false).BuildSettingsPatch().manual_time, std::string("12:10"));
    CHECK_EQ(CoordinatorAt("00:10", true).hour(), std::string("00"));

    TimePageCoordinator typed = CoordinatorAt("08:00", true);
    typed.SetHour("23");
    CHECK_EQ(typed.BuildSettingsPatch().manual_time, std::string("23:00"));
}
