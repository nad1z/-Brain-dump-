# Changelog

All notable changes to Chroninkle (renamed from Followup at 0.6.0) are
documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[Semantic Versioning](docs/versioning.md). History prior to 0.2.0 is available
via `git log`, not backfilled here.

## [Unreleased]

### Added (updates from the internet)

- **Check for updates.** Settings > About has a new button that asks
  GitHub for the latest Brain Dump release and, if it is newer, offers
  **Install version X.Y.Z**: the device downloads it over its own Wi-Fi
  connection straight into the spare firmware slot (nothing is saved to a
  phone, computer or the SD card), verifies it and restarts. The setup web
  page's Firmware Update card has the same button next to **Install from
  file** (renamed from Install Update). Refused while offline or on a
  battery below 30% without USB; a damaged or wrong download leaves the
  running firmware untouched, and the existing rollback still applies.
  (`firmware_update_service` cloud worker using `esp_https_ota`;
  `POST /api/update/cloud/check`, `POST /api/update/cloud/install`, a
  `cloud` object in `GET /api/runtime/update`; manifest URL in
  `CONFIG_CHRONINKLE_FIRMWARE_UPDATE_MANIFEST_URL`.)
- **Releases.** Pushing a `vX.Y.Z` tag now publishes a GitHub Release
  carrying the update file, the full USB-flash image and
  `braindump-manifest.json` (version, URL, size, SHA-256), with notes taken
  from this file. The tag must match `version.txt`; `-rc` style tags are
  published as pre-releases, which devices ignore.
- Auto-sleep now waits while a firmware update is downloading or uploading.

### Added (sound and language)

- **Silent mode** switch on the Settings screen: turns the codec output
  and the speaker amplifier off (NVS `feedback`/`silent`), so cues, the
  post-recording review and Details playback are all skipped; recording
  still works and goes straight to the save menu.
- **Transcription language** on the setup page's Gemini section: Detect
  automatically / Hebrew / English / Hebrew and English mixed (NVS
  `gemini`/`lang`, `GET`/`PATCH /api/settings/transcription`). Gemini's
  API has no language parameter for audio, so the choice is stated in the
  prompt, together with an explicit "never translate". This fixes Hebrew
  recordings sometimes coming back translated to English. Titles now follow
  the transcript's language instead of always being English.

### Changed (Wi-Fi page)

- With Wi-Fi switched off, the Wi-Fi page hides the network list, password
  and Scan/Connect, and they leave the focus order.

### Added (sharing)

- **Share over WiFi** (Settings > Storage). Starts a PIN-protected web page
  on the home network (new `share_service`; four-digit PIN shown on the
  device, five wrong tries lock it for a minute; stops after 10 idle
  minutes, on Wi-Fi disconnect, or from the device). The page lists
  recordings with transcript, type, title and due date, downloads audio,
  exports everything as one Obsidian-ready Markdown file, and adds or
  deletes books. EPUB books are converted to plain text in the browser, so
  the device never unzips or parses HTML. The same Recordings and Books
  sections appear on the setup hotspot page.
- Web page tests: Markdown export unit tests and a Chromium test of the
  share page against a fake device (PIN gate, list, export, audio
  download, EPUB conversion and upload); CI also checks the committed
  portal files match the web source.

### Added (battery)

- **Battery saver** switch on the Wi-Fi page (off by default). It keeps the
  radio off and brings it up in bursts to send recordings waiting for a
  transcript: when three are waiting, when one has waited 30 minutes, or
  on USB power. Switching Wi-Fi on while it is enabled means "sync now".
  A wake that cannot connect gives up after 2 minutes and backs off for
  15. The decision logic is a pure function with host tests.
- The Wi-Fi page's switch rows and spacing are slightly tighter to make
  room for the new switch without shrinking the network list.

### Changed

- **Renamed to Brain Dump.** The boot splash shows a Brain Dump mark and
  credits Chroninkle, Followup and ALXV Labs under "Based on"; onboarding,
  the About page, the setup web page and the manual use the new name; the
  setup hotspot is now `BrainDump-XXXXXX`; the firmware image is
  `braindump.bin`. Internal identifiers (`CONFIG_CHRONINKLE_*`, namespaces)
  keep the upstream name.

### Added

- **Auto filing.** The save menu has a new first choice, **Auto**: the same
  request that transcribes a recording now also returns its type
  (Note/Task/Idea), a short English title and, when a day or time was
  spoken, a due date. Auto recordings take the suggested type; a type
  picked by hand is never overridden. Title and due date are stored in the
  recording's metadata (`title`, `due_local`) for the upcoming reminders
  and calendar work; they are not shown on the device yet.
- **Reminders on the lock screen.** Pending Tasks that have a due date are
  listed first on the lock screen, soonest first, labelled "Today 09:30",
  "Tomorrow", "Overdue" or the date.
- Firmware updates are refused when the battery is below 30% and the
  device is not plugged in.

- **Hebrew on screen.** Transcripts, list previews, summaries, lock-screen
  to-dos and Books now draw Hebrew right to left (Heebo glyphs for the
  letter block, a compact bidirectional layout for mixed Hebrew/English/
  numbers, right alignment for Hebrew lines). English-only text takes the
  same fast path as before. The transcription prompt now says not to
  translate, and summaries are requested in the source language.

- **Firmware updates over Wi-Fi.** The setup web page has a new Firmware
  Update section: it shows the installed version and installs an uploaded
  update file into the spare firmware slot, then restarts the device. Files
  that aren't a Chroninkle firmware image, or that fail verification, are
  refused without changing anything (new `firmware_update_service`
  component; `POST /api/update`, `GET /api/runtime/update`).
- **Tests.** 38 host tests (`tests/host/`) cover the 24-hour clock, Hebrew
  decoding/ordering/wrapping/alignment, the model-reply parser behind Auto
  filing, and reminder due labels. They run on a computer and in CI and are
  not compiled into the firmware.
- **Automatic builds.** GitHub Actions now compiles the firmware on every
  push and attaches the update file and a full USB-flash image, plus PNG
  previews of device screens rendered on a computer (`tools/preview/`).

- A **24-hour clock** option. On the Time page the AM/PM button now cycles
  AM, PM and 24H; saving with 24H selected shows the status bar clock and
  every recording's time as `HH:MM` with no AM/PM. The choice is stored on
  the device (`timezone` NVS namespace, `hour24`) and is also readable and
  settable through the time settings API as `use_24_hour`.

## [1.0.0] - 2026-09-24

This is the last planned release before v2, a complete front-end rewrite
(dropping the current text-driven copy for a graphical, icon-based
interface — see `docs/todo.md`). 1.0 marks this as the stable baseline the
v1 UI settles on before that rewrite starts.

### Added

- A new **About** page under Settings, showing the installed firmware
  version and an acknowledgment of the original Followup project (by ALXV
  Labs) this device builds on.

### Changed

- Finished the in-repo Followup → Chroninkle rename: the ESP-IDF project
  name, the `CONFIG_FOLLOWUP_*` → `CONFIG_CHRONINKLE_*` Kconfig namespace
  (including the Wi-Fi setup hotspot's default name, now
  `Chroninkle-XXXXXX`), the `followup_task_config` → `chroninkle_task_config`
  FreeRTOS task table, remaining source comments/log strings/onboarding
  copy, the `webserver/` setup portal, and the internal docs. Only the
  GitHub repository name remains, tracked separately in `docs/todo.md`.
- Screen navigation now uses a quick partial refresh instead of the slow,
  flashy full-screen waveform for almost every transition. Only going to
  the Home screen and locking/shutting down still do a full refresh; the
  existing idle-deferred ghost-clear flush (`EpaperPanel::NeedsGhostingFlush`)
  keeps ghosting in check automatically as partials become far more
  frequent.

### Fixed

- The AXP2101's emergency 6-second PWR hold now explicitly forces
  power-off (`Axp2101Driver::setLongPressPowerOFF()`, register 0x22 bit 0)
  instead of relying on the chip's unverified factory default, which could
  have been "restart" instead of "power off" — silently breaking the
  documented "hardware escape even if firmware is wedged" guarantee.
  Also removed `Axp2101::SetButtonPowerOffRestarts()`, an unused and
  misleadingly-named wrapper (it actually toggled an unrelated PWROK
  pin-pull-low feature on register 0x10, not this one) that had led a
  previous investigation to the wrong fix.

## [0.6.1] - 2026-09-18

### Fixed

- Selecting a row in Todos or Notes no longer reboots the device. The
  `input_callbacks` dispatcher task ran every page callback on a 4096-byte
  stack, but page entry reads the recording archive off the SD card, and that
  FATFS/SDMMC call chain peaked at 4088 bytes — leaving no margin, so an
  interrupt arriving at depth overwrote the stack canary. FreeRTOS only checks
  that canary at a context switch, which is why the panic appeared on the next
  button press and looked like Select was at fault. The dispatcher stack is now
  8192 bytes, matching the other real-work tasks in the project.

### Added

- The boot log now reports `esp_reset_reason()`, so an unexpected reset is
  distinguishable from a deliberate restart without attaching a serial monitor
  at the right moment.

### Changed

- The boot splash now leads with the new **Chroninkle** name and mark, in a
  stacked lockup (`assets/logos/chroninkle-logo-stacked.png`,
  `EmbeddedLogoId::kChroninkleLogoStacked`), reflecting the project's rename
  from Followup. A horizontal lockup (`chroninkle-logo.png`) and an
  icon-only mark (`chroninkle-icon.png`) are generated alongside it for
  future use. The previous Folloup logo and the ALXV Labs logo it launched
  under move to a smaller "Based on" attribution line at the bottom of the
  same splash (75% of their old splash size) rather than disappearing
  (`display_service::DrawSplashScreen`). No other Followup branding changes
  yet — this is the first step of the rename.
- The Record button's quick tap is now a dedicated **Back** button instead of
  a second select/confirm button: it exits an entered list/scroll/control
  (`button_service::IsBackGesture`). The rocker-middle FN button is now the
  sole select/confirm control (`button_service::IsSelectButton`). Holding the
  rocker's down-tilt no longer exits an entered control either — that hold is
  freed up for continuous scrolling within one, reserved for later. Recording
  (press-and-hold the Record button) is unaffected. Updated the onboarding
  carousel's text and artwork (`assets/images/slide2.png`,
  `assets/images/slide3.png`) to match.

## [0.4.0] - 2026-09-13

### Added

- On-device `.txt` reader: a new "Books" item on the Home menu browses `.txt`
  files in a configurable SD card folder (`CONFIG_FOLLOWUP_TEXT_READER_FOLDER`,
  default `books`) and opens a paginated reading view. Each book remembers its
  last-read page position in a `<filename>.pos` sidecar next to it on the SD
  card. Page turns (UP/DOWN tilt) use a partial refresh; long-press DOWN
  returns to the book list.

## [0.3.1] - 2026-09-13

### Fixed

- Holding PWR to power the device back on after a manual shutdown sometimes
  didn't register on the first attempt. Shortened the AXP2101's PWRON
  power-on hold requirement from 1s to 512ms
  (`Axp2101::PowerKeyPressOnTime::k512Ms`), reducing how much uninterrupted
  contact a single press needs against physical key bounce. Confirmed
  reliable on-device across repeated shutdown/power-on cycles.

## [0.3.0] - 2026-09-11

### Changed

- Reordered the Home screen's main menu to Follow up, Todos, Notes, Topics
  (was Follow up, Topics, Notes, Todos).

## [0.2.0] - 2026-09-11

### Added

- Semantic versioning for the firmware: `version.txt` as the source of truth,
  a boot-time version log line, this changelog, and `docs/versioning.md`
  describing the workflow.

### Changed

- Baselined the starting version at 0.2.0 rather than 0.1.0, reflecting the
  substantial feature work already merged since this repo forked from
  `alxv2016/folloup-sticky` (topics, summarization, offline-transcription
  retry, settings redesign, and more — see `git log` for the full history).
