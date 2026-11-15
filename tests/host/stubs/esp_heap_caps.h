// Host stand-in for ESP-IDF's esp_heap_caps.h: PSRAM-aware allocation becomes plain malloc.
#ifndef TESTS_HOST_STUBS_ESP_HEAP_CAPS_H_
#define TESTS_HOST_STUBS_ESP_HEAP_CAPS_H_
#include <cstdlib>
#define MALLOC_CAP_SPIRAM 0
#define MALLOC_CAP_8BIT 0
inline void* heap_caps_malloc(size_t size, unsigned) { return std::malloc(size); }
inline void heap_caps_free(void* pointer) { std::free(pointer); }
#endif
