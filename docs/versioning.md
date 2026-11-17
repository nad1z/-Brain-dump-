# Versioning

Chroninkle follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

## Source of truth

`version.txt` at the repo root holds the current version. ESP-IDF's build
system reads this file automatically (no CMake wiring needed) and bakes it
into the firmware's app description, which is logged once at boot in
`main/app_shell.cpp` (`Run()`) via `esp_app_get_description()->version`. This
is also what `esptool.py`/`idf.py partition-table`/OTA tooling reports for the
running image.

The `webserver/` setup portal is embedded into and shipped with firmware; it
does not carry an independent version and moves with the firmware version.

## When to bump

The product reached a stable 1.0 at the 1.0.0 release (2026-09-24, the last
release before the v2 rewrite), so strict SemVer applies:

- **MAJOR** — a breaking change (a stored-data format change that isn't
  migrated, a removed setting, etc). The planned v2 front-end rewrite is
  expected to be exactly this.
- **MINOR** — a new or changed user-facing feature/behavior (new screen,
  changed gesture, new setting, etc).
- **PATCH** — a bug fix, or an internal/refactor change with no user-visible
  behavior change.
- **No bump** — docs-only changes, comments, CI/tooling that doesn't affect
  the built firmware.

Before 1.0.0, MAJOR was never bumped (0.x releases used MINOR/PATCH only,
pre-1.0 SemVer convention) — see `git log`/`CHANGELOG.md` history prior to
1.0.0 with that in mind.

## Workflow

Every feature or bugfix branch that changes firmware or webapp behavior:

1. Bumps `version.txt` as part of that change, in the same branch/PR as the
   change itself (not as a separate follow-up).
2. Adds an entry to `CHANGELOG.md` under `## [Unreleased]`.

When cutting a release (merging to `main` and flashing/distributing a build),
move the `[Unreleased]` entries under a new `## [X.Y.Z] - YYYY-MM-DD` heading
in `CHANGELOG.md`, and tag that commit on `main` with an annotated tag
`vX.Y.Z`:

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
```

Pushing the tag runs CI's **Publish release** job: it checks the tag matches
`version.txt`, then publishes a GitHub Release with
`braindump-X.Y.Z-update.bin`, `braindump-X.Y.Z-full-usb-flash.bin` and
`braindump-manifest.json` (project, version, download URL, size, SHA-256),
using this version's `CHANGELOG.md` section as the notes. Devices find it
through `releases/latest/download/braindump-manifest.json`
(`CONFIG_CHRONINKLE_FIRMWARE_UPDATE_MANIFEST_URL`), so **publishing a release
is what makes it reach devices** — only tag what you want installed. A tag
with a suffix (`v1.9.0-rc1`) is published as a pre-release, which `latest`
skips: use that to test a build on your own device via the attached files.

The pre-SemVer tag `v0.01` predates this scheme and can be ignored.
