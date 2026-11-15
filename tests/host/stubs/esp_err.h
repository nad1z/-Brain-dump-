// Host stand-in for ESP-IDF's esp_err.h: just enough for service headers to compile in tests.
#ifndef TESTS_HOST_STUBS_ESP_ERR_H_
#define TESTS_HOST_STUBS_ESP_ERR_H_
typedef int esp_err_t;
#define ESP_OK 0
#define ESP_FAIL -1
#endif
