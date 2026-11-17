// Browser test for the setup page's "Check for updates" button against a fake device that
// walks through check -> available -> download -> restart. Run after `npm run build`:
//   node tests/firmware_update.e2e.mjs [screenshot_dir]
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const shotDir = process.argv[2];

// Fake device state.
let version = '1.8.0';
let cloud = { enabled: true, state: 'IDLE', busy: false, latest_version: '', progress: 0, message: '' };
let polls = 0;
let restarting = 0;
const calls = [];

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function runtimeReply(success = true, message = '') {
  return {
    success,
    message,
    runtime: { version, state: 'IDLE', active: false },
    cloud: { ...cloud, installed_version: version },
  };
}

// Advances the fake check/download a step per poll, like the real worker task.
function advance() {
  polls += 1;
  if (cloud.state === 'CHECKING' && polls >= 2) {
    cloud = { ...cloud, state: 'AVAILABLE', busy: false, latest_version: '1.9.0' };
  } else if (cloud.state === 'DOWNLOADING') {
    cloud = { ...cloud, progress: Math.min(100, cloud.progress + 40) };
    if (cloud.progress >= 100) {
      cloud = { ...cloud, state: 'RESTARTING' };
      restarting = 2;  // the next two requests fail, as if the device were rebooting
    }
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://device');
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(readFileSync(join(dist, 'index.html')));
  }
  if (url.pathname === '/index.js' || url.pathname === '/index.css') {
    res.writeHead(200, { 'Content-Type': url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css' });
    return res.end(readFileSync(join(dist, url.pathname)));
  }
  if (url.pathname === '/api/share/status') {
    return json(res, 200, { success: true, mode: 'setup', pin_required: false, authorized: true });
  }
  if (url.pathname === '/api/runtime/update') {
    if (restarting > 0) {
      restarting -= 1;
      if (restarting === 0) {
        version = '1.9.0';
        cloud = { enabled: true, state: 'IDLE', busy: false, latest_version: '', progress: 0, message: '' };
      }
      req.socket.destroy();
      return undefined;
    }
    advance();
    return json(res, 200, runtimeReply());
  }
  if (url.pathname === '/api/update/cloud/check' && req.method === 'POST') {
    calls.push('check');
    polls = 0;
    cloud = { ...cloud, state: 'CHECKING', busy: true, message: '' };
    return json(res, 200, runtimeReply());
  }
  if (url.pathname === '/api/update/cloud/install' && req.method === 'POST') {
    calls.push('install');
    if (cloud.state !== 'AVAILABLE') {
      return json(res, 409, runtimeReply(false, 'Check for updates first'));
    }
    cloud = { ...cloud, state: 'DOWNLOADING', busy: true, progress: 0 };
    return json(res, 200, runtimeReply());
  }
  return json(res, 404, { success: false, message: 'not found' });
});

await new Promise(resolve => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(base);

  const card = page.locator('#firmwareUpdateCard');
  const button = page.locator('#firmwareCloudBtn');
  const text = page.locator('#firmwareCloudText');
  await card.waitFor({ state: 'visible' });
  await page.locator('#firmwareVersionText', { hasText: 'Installed version: 1.8.0' }).waitFor();
  assert.equal((await button.innerText()).trim(), 'Check for updates');

  await button.click();
  await page.locator('#firmwareCloudBtn', { hasText: 'Install version 1.9.0' }).waitFor({ timeout: 10000 });
  assert.match(await text.innerText(), /1\.9\.0 is available/);
  if (shotDir) {
    await card.scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(shotDir, 'web_cloud_update_available.png'), fullPage: true });
  }

  await button.click();
  await page.locator('#firmwareVersionText', { hasText: 'Installed version: 1.9.0' }).waitFor({ timeout: 20000 });
  assert.deepEqual(calls, ['check', 'install']);
  assert.deepEqual(errors, []);
  console.log('firmware update e2e: all checks passed');
} finally {
  await browser.close();
  server.close();
}
