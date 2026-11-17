// Wording for the device's cloud update state (setup page, Firmware Update card). No imports
// besides types, so it is unit-tested directly (tests/cloudUpdateText.test.ts).
import type { CloudUpdateStatus } from './types';

const CLOUD_IDLE_TEXT =
  'The device can download the latest release itself over its own Wi-Fi connection.';

// Text under the version, and the label of the cloud button, for each cloud state.
export function describeCloudStatus(cloud: CloudUpdateStatus | undefined): {
  text: string;
  button: string;
  action: 'check' | 'install' | 'none';
} {
  if (!cloud || cloud.enabled === false) {
    return {
      text: 'Updates from the internet are turned off in this build.',
      button: 'Check for updates',
      action: 'none',
    };
  }
  const latest = cloud.latest_version ?? '';
  switch (cloud.state) {
    case 'CHECKING':
      return { text: 'Looking for a newer version…', button: 'Checking…', action: 'none' };
    case 'UP_TO_DATE':
      return {
        text: `You have the latest version${latest ? ` (${latest})` : ''}.`,
        button: 'Check for updates',
        action: 'check',
      };
    case 'AVAILABLE':
      return {
        text: `Version ${latest} is available. The device downloads it over its own Wi-Fi connection and restarts by itself.`,
        button: `Install version ${latest}`,
        action: 'install',
      };
    case 'DOWNLOADING':
      return {
        text: 'Downloading. Keep the device powered; it restarts by itself when done.',
        button: `Downloading… ${cloud.progress ?? 0}%`,
        action: 'none',
      };
    case 'RESTARTING':
      return { text: 'Update installed. The device is restarting…', button: 'Restarting…', action: 'none' };
    case 'ERROR':
      return {
        text: cloud.message || 'The last update check failed.',
        button: 'Check for updates',
        action: 'check',
      };
    case 'IDLE':
    default:
      return { text: CLOUD_IDLE_TEXT, button: 'Check for updates', action: 'check' };
  }
}
