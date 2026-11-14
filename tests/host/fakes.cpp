#include "fakes.h"

#include "timezone_service.h"

namespace {
bool g_use_24_hour = false;
}

namespace host_test {
void SetUse24HourClock(bool use_24_hour) { g_use_24_hour = use_24_hour; }
}  // namespace host_test

namespace timezone_service {
bool Use24HourClock() { return g_use_24_hour; }
}  // namespace timezone_service

namespace timezone_service {
// Only the current date is read by the code under test (to label a recording "Today").
Snapshot GetSnapshot()
{
    Snapshot snapshot = {};
    snapshot.settings.use_24_hour = g_use_24_hour;
    return snapshot;
}
}  // namespace timezone_service
