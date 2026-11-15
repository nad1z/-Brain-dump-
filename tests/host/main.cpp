#include <cstdlib>
#include <ctime>
#include <iostream>

#include "check.h"

int main()
{
    // Fixed timezone so date/time formatting tests do not depend on the machine running them.
    setenv("TZ", "UTC", 1);
    tzset();

    for (const host_test::Case& test : host_test::Cases()) {
        const int before = host_test::FailureCount();
        test.run();
        std::cout << (host_test::FailureCount() == before ? "ok    " : "FAIL  ") << test.name << "\n";
    }
    std::cout << host_test::Cases().size() << " tests, " << host_test::FailureCount()
              << " failed checks\n";
    return host_test::FailureCount() == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
