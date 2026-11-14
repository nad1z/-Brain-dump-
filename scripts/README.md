# Scripts

This repo keeps e-paper asset generators ported from the sibling `followup`
firmware repo.

## Timezones

`generate_timezones.mjs` writes `components/timezone_service/generated_timezones.h`: every
IANA timezone in the tz database bundled with Node.js, each with a POSIX `TZ` rule the
device's C library understands, an on-device label such as `Jerusalem (UTC+2/+3)`, and an
alias list (old names such as `Asia/Calcutta`, and the region names older firmware stored).
Each rule is checked against the real clock changes for a full 28-year cycle; zones whose
changes do not follow a yearly rule (Morocco, Western Sahara, Gaza and Hebron follow Ramadan)
use their usual offset all year, and the script lists them. Re-run it after a Node.js update
to pick up tz database changes:

```bash
node scripts/generate_timezones.mjs
```

## E-paper Assets

Source artwork lives in:

- `assets/icons/`
- `assets/logos/`
- `fonts/`

The generators emit monochrome C++ assets for the SSD1677 e-paper UI:

- `generate_epaper_icons.py`: fixed `36x36` icon assets
- `generate_epaper_footer_icons.py`: fixed `44x44` footer icon assets
- `generate_epaper_logos.py`: aspect-ratio-preserving logo assets
- `generate_epaper_fonts.py`: packed ASCII bitmap fonts from TTF files
- `generate_epaper_hebrew_fonts.py`: Hebrew letter glyphs (Heebo) matching each ASCII font's
  size and weight; needs Pillow, runs on any OS (`python3 scripts/generate_epaper_hebrew_fonts.py`)
- `generate_epaper_project_assets.py`: manifest-driven wrapper for all project
  image assets

The PNG generators use macOS `sips`, and the font generator uses macOS
CoreGraphics/CoreText through `ctypes`.

For normal UI work, update `assets/epaper_assets.json` and run:

```bash
python3 scripts/generate_epaper_project_assets.py
```

The lower-level scripts remain available for quick one-off experiments.

Examples:

```bash
python3 scripts/generate_epaper_icons.py \
  --output-header components/project_assets/generated_epaper_icons.h \
  --output-source components/project_assets/generated_epaper_icons.cpp \
  assets/icons/home.png:kHome \
  assets/icons/settings.png:kSettings

python3 scripts/generate_epaper_logos.py \
  --output-header components/project_assets/generated_epaper_logos.h \
  --output-source components/project_assets/generated_epaper_logos.cpp \
  assets/logos/folloup-logo.png:kFollowupLogo

python3 scripts/generate_epaper_fonts.py \
  --output components/epaper_ui/generated_epaper_fonts.cpp \
  fonts/Inter_18pt-SemiBold.ttf:kInter22SemiBold:22
```

Do not hand-edit generated asset files once they are added. Update the source
PNG/TTF files and regenerate instead.
