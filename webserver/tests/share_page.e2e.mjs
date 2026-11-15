// Browser test of the Recordings/Books page against a fake device (no hardware needed).
// Runs the built page (npm run build first) in Chromium via Playwright:
//   node tests/share_page.e2e.mjs [screenshot-dir]
// Checks: PIN gate, recordings list, Markdown export, EPUB -> text conversion and upload.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const shotDir = process.argv[2];
const PIN = '4821';

const recordings = [
  { id: '20261114_170500', created: 1794675900, time_valid: true, date: '2026-11-14', duration_ms: 6000,
    tag: 'task', title: 'Call the bank', due: '2026-11-15T09:00', completed: false, follow_up: false,
    pending_transcription: false, has_audio: true, transcript: 'Remind me to call the bank tomorrow at nine.' },
  { id: '20261113_080000', created: 1794556800, time_valid: true, date: '2026-11-13', duration_ms: 9000,
    tag: 'idea', title: 'Shopping list app', due: '', completed: false, follow_up: false,
    pending_transcription: false, has_audio: false, transcript: 'רעיון: אפליקציה לרשימת קניות.' },
];
let books = [{ name: 'Existing.txt', size: 2048 }];
let uploaded = null;

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://device');
  const authorized = req.headers['x-share-pin'] === PIN;
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(readFileSync(join(dist, 'index.html')));
  }
  if (url.pathname === '/index.js' || url.pathname === '/index.css') {
    res.writeHead(200, { 'Content-Type': url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css' });
    return res.end(readFileSync(join(dist, url.pathname)));
  }
  if (url.pathname === '/api/share/status') {
    return json(res, 200, { success: true, mode: 'share', pin_required: true, authorized });
  }
  if (!authorized) {
    return json(res, 401, { success: false, message: 'Enter the PIN shown on the device.' });
  }
  if (url.pathname === '/api/recordings') {
    return json(res, 200, { success: true, recordings });
  }
  if (url.pathname === '/api/recordings/audio') {
    res.writeHead(200, { 'Content-Type': 'audio/wav' });
    return res.end(Buffer.from('RIFF....WAVE'));
  }
  if (url.pathname === '/api/books' && req.method === 'GET') {
    return json(res, 200, { success: true, books });
  }
  if (url.pathname === '/api/books' && req.method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const name = url.searchParams.get('name').replace(/\.epub$/i, '') .replace(/\.txt$/i, '') + '.txt';
      uploaded = { name, text: Buffer.concat(chunks).toString('utf8') };
      books = [...books, { name, size: uploaded.text.length }];
      json(res, 200, { success: true, name });
    });
    return undefined;
  }
  return json(res, 404, { success: false, message: 'not found' });
});

await new Promise(resolve => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 420, height: 900 }, acceptDownloads: true });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('dialog', dialog => dialog.accept());
  await page.goto(base);

  // PIN gate: setup cards hidden, sign-in shown.
  await page.locator('#shareSignInCard').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#geminiCard').isVisible(), false);
  assert.equal(await page.locator('#recordingsCard').isVisible(), false);
  if (shotDir) await page.screenshot({ path: join(shotDir, 'web_share_pin.png') });

  await page.locator('#sharePinInput').locator('input').fill('1111');
  await page.locator('#sharePinBtn').click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#recordingsCard').isVisible(), false, 'wrong PIN must not open');

  await page.locator('#sharePinInput').locator('input').fill(PIN);
  await page.locator('#sharePinBtn').click();
  await page.locator('#recordingsCard').waitFor({ state: 'visible' });
  await page.locator('#recordingsList li').first().waitFor();
  assert.equal(await page.locator('#recordingsList li').count(), 2);
  const firstItem = await page.locator('#recordingsList li').first().innerText();
  assert.match(firstItem, /Call the bank/);
  assert.match(firstItem, /due 2026-11-15 09:00/);
  assert.equal(await page.locator('#recordingsList li').nth(1).locator('p').getAttribute('dir'), 'auto');

  // Export for Obsidian downloads one Markdown file.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#recordingsExportBtn').click(),
  ]);
  assert.match(download.suggestedFilename(), /^brain-dump-\d{4}-\d{2}-\d{2}\.md$/);
  const markdown = readFileSync(await download.path(), 'utf8');
  assert.ok(markdown.includes('- [ ] Remind me to call the bank tomorrow at nine. 📅 2026-11-15 09:00'));

  // Audio download carries the PIN.
  const [audio] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download audio' }).click(),
  ]);
  assert.equal(audio.suggestedFilename(), '20261114_170500.wav');

  // EPUB upload: converted to text in the browser, then sent.
  await page.locator('#bookFileInput').locator('input[type=file]').setInputFiles(join(here, 'fixtures', 'sample.epub'));
  await page.locator('#bookUploadBtn').click();
  await page.locator('#booksList li', { hasText: 'sample.txt' }).waitFor();
  assert.ok(uploaded, 'book was uploaded');
  assert.equal(uploaded.name, 'sample.txt');
  assert.equal(
    uploaded.text,
    'Sample Book\n\nChapter One\n\nFirst paragraph, spread over lines.\n\nSecond paragraph. Same paragraph.' +
      '\n\nפרק שני\n\nשלום עולם.\n\nOne\n\nTwo'
  );
  if (shotDir) {
    await page.locator('#recordingsCard').scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(shotDir, 'web_share_recordings.png'), fullPage: true });
  }
  assert.deepEqual(errors, []);
  console.log('share page e2e: all checks passed');
} finally {
  await browser.close();
  server.close();
}
