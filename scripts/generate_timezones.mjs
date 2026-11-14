#!/usr/bin/env node
// Generates components/timezone_service/generated_timezones.h: every IANA timezone known to
// this Node.js build (its bundled ICU tz database), each with a POSIX TZ rule string that the
// ESP-IDF C library (newlib) understands, and an on-device label.
//
// The device has no tz database, so each zone is reduced to one POSIX rule
// ("STD-2DST,M3.4.4/26,M10.5.0"). Rules are derived from the real transitions Node reports
// and then checked by replaying the rule against those transitions for every year in
// [kFirstYear, kLastYear]. Zones whose rule cannot be expressed that way (irregular,
// religious-calendar changes, e.g. Morocco's Ramadan switch) fall back to the offset they use
// for most of the year; the script lists them so it is visible.
//
// Abbreviations are always "STD"/"DST": nothing on the device prints them, and it keeps every
// rule in plain POSIX form that newlib parses (no "<+03>" quoting).
//
// Usage: node scripts/generate_timezones.mjs   (re-run after a Node/tzdata update)
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const kFirstYear = 2026;
const kLastYear = 2053; // a full 28-year weekday cycle, so "N days before" rules are exact
const kHour = 3600 * 1000;
const kDay = 24 * kHour;

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, '..', 'components', 'timezone_service', 'generated_timezones.h');

const formatters = new Map();
// UTC offset in minutes east of Greenwich at instant `ms`.
function offsetMinutes(zone, ms) {
  let f = formatters.get(zone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' });
    formatters.set(zone, f);
  }
  const name = f.formatToParts(ms).find(p => p.type === 'timeZoneName').value; // "GMT+05:30"
  if (name === 'GMT') return 0;
  const m = /^GMT([+-])(\d{2}):(\d{2})$/.exec(name);
  if (!m) throw new Error(`unexpected offset ${name} for ${zone}`);
  const v = Number(m[2]) * 60 + Number(m[3]);
  return m[1] === '-' ? -v : v;
}

// All transitions (instant of the first minute with the new offset) in [start, end).
function transitions(zone, start, end) {
  const out = [];
  let prev = offsetMinutes(zone, start);
  for (let t = start + kDay; t <= end; t += kDay) {
    const cur = offsetMinutes(zone, t);
    if (cur !== prev) {
      let lo = t - kDay;
      let hi = t;
      while (hi - lo > 60 * 1000) {
        const mid = lo + Math.floor((hi - lo) / 2 / 60000) * 60000;
        if (offsetMinutes(zone, mid) === prev) lo = mid;
        else hi = mid;
      }
      out.push({ at: hi, from: prev, to: cur });
      prev = cur;
    }
  }
  return out;
}

const yearStart = y => Date.UTC(y, 0, 1);

// --- POSIX rule pieces ----------------------------------------------------------------------
function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate(); // m is 1-based
}
// Day of month for "Mm.w.d": week w (1..5, 5 = last) of month m, weekday d (0 = Sunday).
function ruleDay(y, m, w, d) {
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  let day = 1 + ((d - firstWeekday + 7) % 7) + (w - 1) * 7;
  const dim = daysInMonth(y, m);
  while (day > dim) day -= 7;
  return day;
}
// UTC instant a rule fires in year y; `seconds` is local wall time in `offset` (minutes east).
function ruleInstant(y, rule, offset) {
  const day = ruleDay(y, rule.m, rule.w, rule.d);
  return Date.UTC(y, rule.m - 1, day) + rule.seconds * 1000 - offset * 60000;
}

function posixOffset(minutesEast) {
  // POSIX offsets are west-positive.
  const west = -minutesEast;
  const sign = west < 0 ? '-' : '';
  const abs = Math.abs(west);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  return sign + h + (mm ? ':' + String(mm).padStart(2, '0') : '');
}
function posixTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  if (h === 2 && mm === 0) return ''; // POSIX default is 02:00
  return '/' + h + (mm ? ':' + String(mm).padStart(2, '0') : '');
}

// Candidate rules for one transition (local wall time in `wallOffset`), allowing the
// weekday to be moved up to 3 days earlier with the hour pushed past 24 (Israel's
// "Friday before the last Sunday" is "4th Thursday at 26:00"). newlib reads hours as
// unsigned, so only non-negative times are offered.
function candidates(t, wallOffset) {
  const local = new Date(t.at + wallOffset * 60000);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth() + 1;
  const day = local.getUTCDate();
  const secondsOfDay = local.getUTCHours() * 3600 + local.getUTCMinutes() * 60;
  const out = [];
  for (let shift = 0; shift <= 3; shift++) {
    const d0 = day - shift;
    if (d0 < 1) break;
    const weekday = new Date(Date.UTC(y, m - 1, d0)).getUTCDay();
    const seconds = secondsOfDay + shift * kDay / 1000;
    const week = Math.ceil(d0 / 7);
    out.push({ m, w: week, d: weekday, seconds });
    if (d0 + 7 > daysInMonth(y, m)) out.push({ m, w: 5, d: weekday, seconds });
  }
  return out;
}
const ruleText = r => `M${r.m}.${r.w}.${r.d}${posixTime(r.seconds)}`;

function deriveRule(zone) {
  const perYear = [];
  for (let y = kFirstYear; y <= kLastYear; y++) {
    perYear.push(transitions(zone, yearStart(y), yearStart(y + 1)));
  }
  const counts = new Set(perYear.map(list => list.length));
  if (counts.size === 1 && counts.has(0)) {
    return { tz: `STD${posixOffset(offsetMinutes(zone, yearStart(kFirstYear)))}`, fixed: true };
  }
  if (counts.size === 1 && counts.has(2)) {
    const all = perYear.flat();
    const std = Math.min(...all.map(t => Math.min(t.from, t.to)));
    const dst = Math.max(...all.map(t => Math.max(t.from, t.to)));
    const starts = all.filter(t => t.to === dst);
    const ends = all.filter(t => t.to === std);
    if (starts.length === perYear.length && ends.length === perYear.length) {
      // Wall time of a start is in standard time; of an end, in daylight time.
      const pick = (list, wallOffset) => {
        for (const c of candidates(list[0], wallOffset)) {
          const text = ruleText(c);
          if (list.every(t => ruleInstant(new Date(t.at).getUTCFullYear(), c, wallOffset) === t.at
              || ruleInstant(new Date(t.at + wallOffset * 60000).getUTCFullYear(), c, wallOffset) === t.at)) {
            return text;
          }
        }
        return null;
      };
      const startRule = pick(starts, std);
      const endRule = pick(ends, dst);
      if (startRule && endRule) {
        const dstPart = dst - std === 60 ? '' : posixOffset(dst);
        return {
          tz: `STD${posixOffset(std)}DST${dstPart},${startRule},${endRule}`,
          fixed: false,
          std,
          dst,
        };
      }
    }
  }
  // Irregular: use the offset in force for most of the first year.
  const tally = new Map();
  for (let t = yearStart(kFirstYear); t < yearStart(kFirstYear + 1); t += kDay) {
    const o = offsetMinutes(zone, t);
    tally.set(o, (tally.get(o) || 0) + 1);
  }
  const usual = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return { tz: `STD${posixOffset(usual)}`, fixed: true, irregular: true };
}

function utcLabel(minutesEast) {
  if (minutesEast === 0) return 'UTC';
  const sign = minutesEast < 0 ? '-' : '+';
  const abs = Math.abs(minutesEast);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  return `UTC${sign}${h}${mm ? ':' + String(mm).padStart(2, '0') : ''}`;
}
function shortOffset(minutesEast) {
  const sign = minutesEast < 0 ? '-' : '+';
  const abs = Math.abs(minutesEast);
  const mm = abs % 60;
  return `${sign}${Math.floor(abs / 60)}${mm ? ':' + String(mm).padStart(2, '0') : ''}`;
}

// "America/Argentina/Buenos_Aires" -> region "America", city "Buenos Aires, Argentina".
function splitName(zone) {
  const parts = zone.split('/');
  if (parts.length === 1) return { region: 'Other', city: zone.replace(/_/g, ' ') };
  const region = parts[0];
  const rest = parts.slice(1).map(p => p.replace(/_/g, ' '));
  const city = rest.length > 1 ? `${rest[rest.length - 1]}, ${rest.slice(0, -1).join(', ')}` : rest[0];
  return { region, city };
}

// ICU (and so Node's Intl) still lists some zones under names the tz database has since
// renamed. Store the current names; keep the old ones as aliases so a browser that reports
// either form still finds its zone.
const kRenamed = {
  'America/Buenos_Aires': 'America/Argentina/Buenos_Aires',
  'America/Catamarca': 'America/Argentina/Catamarca',
  'America/Cordoba': 'America/Argentina/Cordoba',
  'America/Jujuy': 'America/Argentina/Jujuy',
  'America/Mendoza': 'America/Argentina/Mendoza',
  'America/Coral_Harbour': 'America/Atikokan',
  'America/Godthab': 'America/Nuuk',
  'America/Indianapolis': 'America/Indiana/Indianapolis',
  'America/Louisville': 'America/Kentucky/Louisville',
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Atlantic/Faeroe': 'Atlantic/Faroe',
  'Europe/Kiev': 'Europe/Kyiv',
  'Pacific/Enderbury': 'Pacific/Kanton',
  'Pacific/Ponape': 'Pacific/Pohnpei',
  'Pacific/Truk': 'Pacific/Chuuk',
};
const kExtraAliases = {
  'Asia/Tel_Aviv': 'Asia/Jerusalem',
  Israel: 'Asia/Jerusalem',
  'Etc/UTC': 'UTC',
  'Etc/GMT': 'UTC',
  GMT: 'UTC',
  'US/Eastern': 'America/New_York',
  'US/Central': 'America/Chicago',
  'US/Mountain': 'America/Denver',
  'US/Pacific': 'America/Los_Angeles',
  'US/Alaska': 'America/Anchorage',
  'US/Hawaii': 'Pacific/Honolulu',
  // Region names used by firmware before 1.7.0, still stored on devices that picked them.
  North_America_Eastern: 'America/New_York',
  North_America_Central: 'America/Chicago',
  North_America_Mountain: 'America/Denver',
  North_America_Pacific: 'America/Los_Angeles',
  North_America_Alaska: 'America/Anchorage',
  North_America_Hawaii: 'Pacific/Honolulu',
  UK: 'Europe/London',
  Central_Europe: 'Europe/Berlin',
  Eastern_Europe: 'Europe/Bucharest',
  Japan: 'Asia/Tokyo',
  China: 'Asia/Shanghai',
  Australia_Eastern: 'Australia/Sydney',
  Australia_Central: 'Australia/Adelaide',
  Australia_Western: 'Australia/Perth',
  EST5EDT: 'America/New_York',
  CST6CDT: 'America/Chicago',
  MST7MDT: 'America/Denver',
  PST8PDT: 'America/Los_Angeles',
};
const zones = Intl.supportedValuesOf('timeZone').filter(z => z !== 'UTC');
const rows = [];
const irregular = [];
for (const zone of zones) {
  const rule = deriveRule(zone);
  if (rule.irregular) irregular.push(zone);
  const name = kRenamed[zone] || zone;
  const { region, city } = splitName(name);
  const offsets = rule.fixed
    ? utcLabel(-parsePosixWest(rule.tz))
    : `${utcLabel(rule.std)}/${shortOffset(rule.dst)}`;
  rows.push({ zone: name, tz: rule.tz, region, label: `${city} (${offsets})` });
}
function parsePosixWest(tz) {
  const m = /^STD(-?)(\d+)(?::(\d+))?$/.exec(tz);
  const v = Number(m[2]) * 60 + Number(m[3] || 0);
  return m[1] === '-' ? -v : v;
}
rows.sort((a, b) => (a.region === b.region ? a.label.localeCompare(b.label) : a.region.localeCompare(b.region)));
rows.unshift({ zone: 'UTC', tz: 'UTC0', region: 'UTC', label: 'UTC (no daylight saving)' });

const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const lines = rows.map(r => `    {"${esc(r.zone)}", "${esc(r.tz)}", "${esc(r.region)}", "${esc(r.label)}"},`);
const known = new Set(rows.map(r => r.zone));
const aliases = Object.entries({ ...kRenamed, ...kExtraAliases }).sort((a, b) => a[0].localeCompare(b[0]));
for (const [alias, target] of aliases) {
  if (!known.has(target)) throw new Error(`alias ${alias} -> unknown zone ${target}`);
  if (known.has(alias)) throw new Error(`alias ${alias} is also a zone`);
}
const aliasLines = aliases.map(([a, t]) => `    {"${esc(a)}", "${esc(t)}"},`);
const header = `// Generated by scripts/generate_timezones.mjs from the tz database bundled with Node.js
// ${process.versions.node} (tzdata ${process.versions.tz}). Do not edit by hand; re-run the script.
//
// ${rows.length} zones. Each rule was checked against the real transitions for ${kFirstYear}-${kLastYear}.
// Zones without a regular yearly rule use their usual offset all year: ${irregular.join(', ') || 'none'}.
#ifndef TIMEZONE_SERVICE_GENERATED_TIMEZONES_H_
#define TIMEZONE_SERVICE_GENERATED_TIMEZONES_H_

namespace timezone_service {
namespace generated {

struct ZoneEntry {
    const char* name;    // IANA name, e.g. "Asia/Jerusalem"
    const char* tz;      // POSIX TZ rule for setenv("TZ")
    const char* region;  // first part of the name, used to group the on-device picker
    const char* label;   // e.g. "Jerusalem (UTC+2/+3)"
};

inline constexpr ZoneEntry kZones[] = {
${lines.join('\n')}
};

struct AliasEntry {
    const char* alias;  // old or alternative name, e.g. "Asia/Calcutta" or "Israel"
    const char* name;   // the kZones entry it means
};

inline constexpr AliasEntry kAliases[] = {
${aliasLines.join('\n')}
};

}  // namespace generated
}  // namespace timezone_service

#endif  // TIMEZONE_SERVICE_GENERATED_TIMEZONES_H_
`;
writeFileSync(outPath, header);
console.log(`wrote ${rows.length} zones to ${outPath}`);
console.log(`irregular (usual offset all year): ${irregular.join(', ') || 'none'}`);
