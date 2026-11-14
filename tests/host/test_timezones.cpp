// The generated zone table (components/timezone_service/generated_timezones.h, from
// scripts/generate_timezones.mjs) and the Time page's clock status line.
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <string>

#include "../../components/timezone_service/generated_timezones.h"
#include "check.h"
#include "time_page_coordinator.h"

namespace {

using timezone_service::generated::kAliases;
using timezone_service::generated::kZones;
using timezone_service::generated::ZoneEntry;

const ZoneEntry* Find(const char* name)
{
    for (const ZoneEntry& zone : kZones) {
        if (std::strcmp(zone.name, name) == 0) {
            return &zone;
        }
    }
    return nullptr;
}

// Local wall time "HH:MM" in `zone` at a UTC instant.
std::string LocalAt(const ZoneEntry& zone, int year, int month, int day, int hour, int minute)
{
    setenv("TZ", zone.tz, 1);
    tzset();
    std::tm utc = {};
    utc.tm_year = year - 1900;
    utc.tm_mon = month - 1;
    utc.tm_mday = day;
    utc.tm_hour = hour;
    utc.tm_min = minute;
    const std::time_t instant = timegm(&utc);
    std::tm local = {};
    localtime_r(&instant, &local);
    char buffer[16] = {};
    std::strftime(buffer, sizeof(buffer), "%H:%M", &local);
    return buffer;
}

}  // namespace

TEST(timezone_table_has_current_names_and_utc_first)
{
    CHECK(std::strcmp(kZones[0].name, "UTC") == 0);
    CHECK(Find("Asia/Jerusalem") != nullptr);
    CHECK(Find("Asia/Kolkata") != nullptr);
    CHECK(Find("Europe/Kyiv") != nullptr);
    CHECK(Find("Asia/Calcutta") == nullptr);  // old names are aliases, not entries
}

TEST(timezone_aliases_point_at_real_zones)
{
    for (const auto& alias : kAliases) {
        CHECK(Find(alias.name) != nullptr);
    }
}

TEST(timezone_israel_changes_on_friday_before_last_sunday)
{
    const ZoneEntry* zone = Find("Asia/Jerusalem");
    CHECK(zone != nullptr);
    // 2026: summer time starts Friday 27 March at 02:00 local (00:00 UTC).
    CHECK_EQ(LocalAt(*zone, 2026, 3, 26, 23, 30), std::string("01:30"));
    CHECK_EQ(LocalAt(*zone, 2026, 3, 27, 0, 30), std::string("03:30"));
    // 2023 had March 31 on a Friday: the change was still Friday 24 March.
    CHECK_EQ(LocalAt(*zone, 2023, 3, 24, 0, 30), std::string("03:30"));
    CHECK_EQ(LocalAt(*zone, 2023, 3, 23, 23, 30), std::string("01:30"));
    // Winter: UTC+2, the time the user expected in November.
    CHECK_EQ(LocalAt(*zone, 2026, 11, 14, 18, 22), std::string("20:22"));
}

TEST(timezone_nuuk_changes_saturday_evening)
{
    const ZoneEntry* zone = Find("America/Nuuk");
    CHECK(zone != nullptr);
    // Clocks go forward at 23:00 Saturday 28 March 2026 local (01:00 UTC Sunday).
    CHECK_EQ(LocalAt(*zone, 2026, 3, 29, 0, 30), std::string("22:30"));
    CHECK_EQ(LocalAt(*zone, 2026, 3, 29, 1, 30), std::string("00:30"));
}

TEST(timezone_southern_hemisphere_and_fixed_zones)
{
    const ZoneEntry* sydney = Find("Australia/Sydney");
    CHECK(sydney != nullptr);
    CHECK_EQ(LocalAt(*sydney, 2026, 1, 15, 0, 0), std::string("11:00"));  // summer +11
    CHECK_EQ(LocalAt(*sydney, 2026, 7, 15, 0, 0), std::string("10:00"));  // winter +10

    const ZoneEntry* kolkata = Find("Asia/Kolkata");
    CHECK(kolkata != nullptr);
    CHECK_EQ(LocalAt(*kolkata, 2026, 6, 1, 0, 0), std::string("05:30"));
}

TEST(time_page_status_says_where_the_time_came_from)
{
    timezone_service::Snapshot snapshot = {};
    snapshot.settings.timezone_name = "UTC";
    snapshot.settings.use_24_hour = true;
    snapshot.runtime.current_date = "2026-11-14";
    snapshot.runtime.current_time = "18:22";

    TimePageCoordinator unset;
    unset.RefreshFromService(snapshot, {});
    CHECK(unset.ClockStatusText().rfind("Clock not set", 0) == 0);

    snapshot.runtime.time_valid = true;
    snapshot.runtime.time_source = timezone_service::TimeSource::kManual;
    TimePageCoordinator manual;
    manual.RefreshFromService(snapshot, {});
    CHECK(manual.ClockStatusText().rfind("Set by hand", 0) == 0);

    setenv("TZ", "UTC0", 1);
    tzset();
    snapshot.runtime.time_source = timezone_service::TimeSource::kNtp;
    snapshot.runtime.last_network_sync_epoch = 1794680520;  // 2026-11-14 18:22 UTC
    TimePageCoordinator synced;
    synced.RefreshFromService(snapshot, {});
    CHECK(synced.ClockStatusText().rfind("Set over Wi-Fi at 18:22.", 0) == 0);
}
