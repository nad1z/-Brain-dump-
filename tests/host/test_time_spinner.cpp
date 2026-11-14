// Time page number fields changed with the rocker (main/time_page_coordinator): select a
// field, tilt up/down to step its value, Select keeps it, Back restores the old value.
#include <string>

#include "check.h"
#include "time_page_coordinator.h"

namespace {

using page_navigation::NavigationItemRole;

constexpr int kUp = -1;    // UP arrives as delta -1
constexpr int kDown = 1;   // DOWN arrives as delta +1

TimePageCoordinator CoordinatorAt(const std::string& date, const std::string& time24,
                                  bool use_24_hour)
{
    timezone_service::Snapshot snapshot = {};
    snapshot.settings.timezone_name = "UTC";
    snapshot.settings.use_24_hour = use_24_hour;
    snapshot.runtime.current_date = date;
    snapshot.runtime.current_time = time24;
    TimePageCoordinator coordinator;
    coordinator.RefreshFromService(snapshot, {});
    return coordinator;
}

}  // namespace

TEST(spinner_tilt_up_raises_and_down_lowers)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-11-14", "20:22", true);
    CHECK(coordinator.BeginEdit(NavigationItemRole::kTimePageMinute));
    CHECK(coordinator.BuildState().minute.active);
    CHECK(coordinator.MoveFocus(kUp));
    CHECK_EQ(coordinator.minute(), std::string("23"));
    CHECK(coordinator.MoveFocus(kDown));
    CHECK(coordinator.MoveFocus(kDown));
    CHECK_EQ(coordinator.minute(), std::string("21"));
    CHECK(coordinator.CommitEdit());
    CHECK(!coordinator.IsEditing());
    CHECK_EQ(coordinator.BuildSettingsPatch().manual_time, std::string("20:21"));
}

TEST(spinner_wraps_at_range_edges)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-11-14", "23:59", true);
    coordinator.BeginEdit(NavigationItemRole::kTimePageHour);
    coordinator.MoveFocus(kUp);
    CHECK_EQ(coordinator.hour(), std::string("00"));
    coordinator.CommitEdit();

    coordinator.BeginEdit(NavigationItemRole::kTimePageMinute);
    coordinator.MoveFocus(kUp);
    CHECK_EQ(coordinator.minute(), std::string("00"));
    coordinator.MoveFocus(kDown);
    CHECK_EQ(coordinator.minute(), std::string("59"));
}

TEST(spinner_twelve_hour_hour_runs_one_to_twelve)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-11-14", "12:00", false);
    CHECK_EQ(coordinator.hour(), std::string("12"));
    coordinator.BeginEdit(NavigationItemRole::kTimePageHour);
    coordinator.MoveFocus(kUp);
    CHECK_EQ(coordinator.hour(), std::string("01"));
    coordinator.MoveFocus(kDown);
    coordinator.MoveFocus(kDown);
    CHECK_EQ(coordinator.hour(), std::string("11"));
}

TEST(spinner_back_restores_the_old_value)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-11-14", "20:22", true);
    coordinator.BeginEdit(NavigationItemRole::kTimePageHour);
    coordinator.MoveFocus(kUp);
    coordinator.MoveFocus(kUp);
    CHECK_EQ(coordinator.hour(), std::string("22"));
    CHECK(coordinator.CancelEdit());
    CHECK_EQ(coordinator.hour(), std::string("20"));
    CHECK(!coordinator.CancelEdit());  // nothing left to cancel: Back falls through
}

TEST(spinner_held_tilt_speeds_up_minutes_and_years)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-11-14", "10:02", true);
    coordinator.BeginEdit(NavigationItemRole::kTimePageMinute);
    coordinator.MoveFocus(kUp);         // press: 03
    coordinator.MoveFocus(kUp, true);   // repeats 1..3: 04, 05, 06
    coordinator.MoveFocus(kUp, true);
    coordinator.MoveFocus(kUp, true);
    CHECK_EQ(coordinator.minute(), std::string("06"));
    coordinator.MoveFocus(kUp, true);   // repeat 4: jumps to the next multiple of 5
    CHECK_EQ(coordinator.minute(), std::string("10"));
    coordinator.MoveFocus(kUp, true);
    CHECK_EQ(coordinator.minute(), std::string("15"));
    coordinator.CommitEdit();

    coordinator.BeginEdit(NavigationItemRole::kTimePageYear);
    for (int i = 0; i < 5; ++i) {
        coordinator.MoveFocus(kUp, i > 0);
    }
    // Press and three repeats step by one (2027..2030); the fourth repeat jumps by ten.
    CHECK_EQ(coordinator.year(), std::string("2040"));
}

TEST(spinner_day_follows_month_length)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-01-31", "08:00", true);
    coordinator.BeginEdit(NavigationItemRole::kTimePageMonth);
    coordinator.MoveFocus(kUp);  // February 2026 has 28 days
    coordinator.CommitEdit();
    CHECK_EQ(coordinator.month(), std::string("02"));
    CHECK_EQ(coordinator.day(), std::string("28"));

    coordinator.BeginEdit(NavigationItemRole::kTimePageDay);
    coordinator.MoveFocus(kUp);
    CHECK_EQ(coordinator.day(), std::string("01"));
}

TEST(spinner_does_not_move_focus_while_editing)
{
    TimePageCoordinator coordinator = CoordinatorAt("2026-11-14", "20:22", true);
    coordinator.PrepareForShow();
    const int focus_before = coordinator.focus().index();
    coordinator.BeginEdit(NavigationItemRole::kTimePageDay);
    coordinator.MoveFocus(kDown);
    CHECK_EQ(coordinator.focus().index(), focus_before);
    coordinator.CommitEdit();
    coordinator.MoveFocus(kDown);
    CHECK(coordinator.focus().index() != focus_before);
}
