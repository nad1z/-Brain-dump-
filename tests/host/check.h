// Minimal test harness for the host tests: no framework to install, nothing linked into the
// firmware. Each TEST registers itself; main.cpp runs them all and reports failures.
#ifndef TESTS_HOST_CHECK_H_
#define TESTS_HOST_CHECK_H_

#include <functional>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

namespace host_test {

struct Case {
    const char* name;
    std::function<void()> run;
};

inline std::vector<Case>& Cases()
{
    static std::vector<Case> cases;
    return cases;
}

inline int& FailureCount()
{
    static int failures = 0;
    return failures;
}

struct Registrar {
    Registrar(const char* name, std::function<void()> run) { Cases().push_back({name, std::move(run)}); }
};

template <typename A, typename B>
void ExpectEqual(const A& actual, const B& expected, const char* expression, const char* file,
                 int line)
{
    if (actual == expected) {
        return;
    }
    ++FailureCount();
    std::ostringstream message;
    message << file << ":" << line << ": " << expression << "\n    actual:   " << actual
            << "\n    expected: " << expected << "\n";
    std::cerr << message.str();
}

}  // namespace host_test

#define TEST(name)                                                            \
    static void name();                                                       \
    static const host_test::Registrar registrar_##name(#name, name);          \
    static void name()

#define CHECK(condition)                                                      \
    do {                                                                      \
        if (!(condition)) {                                                   \
            ++host_test::FailureCount();                                      \
            std::cerr << __FILE__ << ":" << __LINE__ << ": CHECK failed: " #condition "\n"; \
        }                                                                     \
    } while (false)

#define CHECK_EQ(actual, expected) \
    host_test::ExpectEqual((actual), (expected), #actual " == " #expected, __FILE__, __LINE__)

#endif  // TESTS_HOST_CHECK_H_
