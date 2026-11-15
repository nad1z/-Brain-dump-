// Unit tests for the Obsidian export (run with `npm test`; not part of the page build).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { recordingsToMarkdown, type RecordingSummary } from '../src/portal/exportMarkdown.ts';

process.env.TZ = 'UTC';

function recording(overrides: Partial<RecordingSummary>): RecordingSummary {
  return {
    id: 'r1', created: 1794675900, time_valid: true, date: '2026-11-14', duration_ms: 4000,
    tag: 'note', title: '', due: '', completed: false, follow_up: false,
    pending_transcription: false, has_audio: true, transcript: '', ...overrides,
  };
}

const exportedAt = new Date('2026-11-15T10:00:00Z');

test('starts with front matter and a heading', () => {
  const md = recordingsToMarkdown([], exportedAt);
  assert.match(md, /^---\nsource: Brain Dump\nexported: 2026-11-15T10:00:00.000Z\nrecordings: 0\n---\n\n# Brain Dump/);
});

test('tasks become Obsidian checkboxes with a due date', () => {
  const md = recordingsToMarkdown(
    [recording({ tag: 'task', title: 'Call the bank', transcript: 'Call the bank\ntomorrow.', due: '2026-11-15T09:00' })],
    exportedAt
  );
  assert.ok(md.includes('## 2026-11-14 17:05 · Task · Call the bank'));
  assert.ok(md.includes('- [ ] Call the bank tomorrow. 📅 2026-11-15 09:00'));
});

test('completed tasks are ticked and follow-ups tagged', () => {
  const md = recordingsToMarkdown(
    [recording({ tag: 'task', transcript: 'Done thing', completed: true, follow_up: true })],
    exportedAt
  );
  assert.ok(md.includes('- [x] Done thing'));
  assert.ok(md.includes('#follow-up'));
});

test('newest recordings come first and notes keep their line breaks', () => {
  const md = recordingsToMarkdown(
    [
      recording({ id: 'old', created: 1700000000, title: 'Old', transcript: 'first' }),
      recording({ id: 'new', created: 1800000000, title: 'New', tag: 'idea', transcript: 'line one\nline two' }),
    ],
    exportedAt
  );
  assert.ok(md.indexOf('Idea · New') < md.indexOf('Note · Old'));
  assert.ok(md.includes('line one\nline two'));
});

test('missing transcripts and unset clocks are explained', () => {
  const md = recordingsToMarkdown(
    [
      recording({ id: 'a', pending_transcription: true }),
      recording({ id: 'b', created: 0, time_valid: false, date: '2026-01-02' }),
    ],
    exportedAt
  );
  assert.ok(md.includes('_Waiting for a transcript._'));
  assert.ok(md.includes('_No transcript (audio only)._'));
  assert.ok(md.includes('## 2026-01-02 · Note · Note'));
});

test('hebrew transcripts are kept as written', () => {
  const md = recordingsToMarkdown([recording({ transcript: 'לקנות חלב' })], exportedAt);
  assert.ok(md.includes('לקנות חלב'));
});
