// Test doubles for the few service functions the code under test calls. The real services
// talk to NVS/Wi-Fi and cannot run on a computer.
#ifndef TESTS_HOST_FAKES_H_
#define TESTS_HOST_FAKES_H_

namespace host_test {
// What timezone_service::Use24HourClock() returns during a test.
void SetUse24HourClock(bool use_24_hour);
}  // namespace host_test

#endif  // TESTS_HOST_FAKES_H_
