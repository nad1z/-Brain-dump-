#!/usr/bin/env bash
# Builds and runs the host tests on a computer. Nothing here is part of the firmware: ESP-IDF
# only compiles main/ and components/, so these files never reach the device.
# Needs g++ and cJSON headers (Debian/Ubuntu: apt-get install libcjson-dev).
# Usage: tests/host/run.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
out="${TEST_BUILD_DIR:-$here/build}"
mkdir -p "$out"

cjson_include="/usr/include/cjson"
if [ ! -f "$cjson_include/cJSON.h" ]; then
    echo "cJSON headers not found in $cjson_include (install libcjson-dev)" >&2
    exit 2
fi

g++ -std=c++20 -O1 -g -Wall -Wextra -Wno-unused-parameter -Wno-missing-field-initializers \
    -include cstdint -include cstddef -include cstring -include string \
    -I"$here" -I"$here/stubs" -I"$cjson_include" \
    -I"$root/main" \
    -I"$root/components/epaper_ui" \
    -I"$root/components/epaper_ui/include" \
    -I"$root/components/design_tokens/include" \
    -I"$root/components/project_assets" \
    -I"$root/components/page_navigation/include" \
    -I"$root/components/timezone_service/include" \
    -I"$root/components/recording_archive_service/include" \
    -I"$root/components/recording_service/include" \
    -I"$root/components/gemini_service/include" \
    "$here"/*.cpp \
    "$root"/components/epaper_ui/*.cpp \
    "$root"/components/project_assets/*.cpp \
    "$root"/components/page_navigation/*.cpp \
    "$root/components/gemini_service/organized_transcript.cpp" \
    "$root/main/timeline_format.cpp" \
    "$root/main/time_page_coordinator.cpp" \
    "$root/main/wifi_saver_policy.cpp" \
    -lcjson -o "$out/host_tests"

"$out/host_tests"
