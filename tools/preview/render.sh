#!/usr/bin/env bash
# Renders device screens to PNG on a computer (no board, no ESP-IDF needed).
# Usage: tools/preview/render.sh [output_dir]   (default: tools/preview/out)
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
out="${1:-$root/tools/preview/out}"
mkdir -p "$out"
g++ -std=c++20 -O1 -w -include cstdint -include cstddef -include cstring -include string \
    -I"$root/components/epaper_ui/include" \
    -I"$root/components/design_tokens/include" \
    -I"$root/components/project_assets" \
    "$root/tools/preview/preview_main.cpp" \
    "$root"/components/epaper_ui/*.cpp \
    "$root"/components/project_assets/*.cpp \
    -o "$out/preview"
"$out/preview" "$out"
python3 - "$out" <<'PY'
import glob, sys
from PIL import Image
for path in glob.glob(sys.argv[1] + "/*.pgm"):
    Image.open(path).save(path[:-4] + ".png")
PY
