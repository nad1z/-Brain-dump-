// Unit tests for the cloud update wording on the setup page (run with `npm test`).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { describeCloudStatus } from '../src/portal/cloudUpdateText.ts';

test('an available release offers to install it by version', () => {
  const described = describeCloudStatus({
    enabled: true,
    state: 'AVAILABLE',
    latest_version: '1.9.0',
  });
  assert.equal(described.action, 'install');
  assert.equal(described.button, 'Install version 1.9.0');
  assert.match(described.text, /1\.9\.0 is available/);
});

test('busy states disable the button', () => {
  for (const state of ['CHECKING', 'DOWNLOADING', 'RESTARTING'] as const) {
    assert.equal(describeCloudStatus({ enabled: true, state, progress: 40 }).action, 'none');
  }
  assert.equal(
    describeCloudStatus({ enabled: true, state: 'DOWNLOADING', progress: 40 }).button,
    'Downloading… 40%'
  );
});

test('errors show the device message and allow another check', () => {
  const described = describeCloudStatus({
    enabled: true,
    state: 'ERROR',
    message: 'Could not reach the update server. Try again later.',
  });
  assert.equal(described.action, 'check');
  assert.equal(described.text, 'Could not reach the update server. Try again later.');
});

test('older firmware without cloud support, or a build with it off, cannot check', () => {
  assert.equal(describeCloudStatus(undefined).action, 'none');
  assert.equal(describeCloudStatus({ enabled: false, state: 'IDLE' }).action, 'none');
});

test('up to date names the latest release', () => {
  assert.equal(
    describeCloudStatus({ enabled: true, state: 'UP_TO_DATE', latest_version: '1.8.0' }).text,
    'You have the latest version (1.8.0).'
  );
});
