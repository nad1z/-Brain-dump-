import { fetchUpdateRuntimeJson } from './api';
import { UPDATE_RUNTIME_API, UPDATE_UPLOAD_API } from './constants';
import type { CardField, StatusType } from './types';

type FileUploadField = HTMLElement & {
  disabled: boolean;
  files: FileList | null;
  progressHidden: boolean;
  progressMax: number;
  progressMessageText: string;
  progressValue: number;
};

interface FirmwareUpdateDeps {
  card: CardField;
  fileInput: FileUploadField;
  uploadBtn: HTMLButtonElement;
  versionText: HTMLElement;
}

interface UploadReply {
  success?: boolean;
  message?: string;
}

// How long to wait for the device to come back after it restarts into the new firmware.
const RESTART_POLL_INTERVAL_MS = 2000;
const RESTART_POLL_ATTEMPTS = 45;

export function createFirmwareUpdateController(deps: FirmwareUpdateDeps) {
  let busy = false;
  let installedVersion = '';

  const notify = (message: string, type: StatusType = 'info') =>
    deps.card.setNotification(message, type);

  const selectedFile = () => deps.fileInput.files?.[0] ?? null;

  function syncControls() {
    deps.fileInput.disabled = busy;
    deps.uploadBtn.disabled = busy || !selectedFile();
  }

  function showVersion(version: string) {
    installedVersion = version;
    deps.versionText.textContent = version
      ? `Installed version: ${version}`
      : 'Installed version: unknown';
  }

  async function refreshVersion(): Promise<string> {
    const data = await fetchUpdateRuntimeJson(UPDATE_RUNTIME_API);
    const version = data.runtime?.version ?? '';
    showVersion(version);
    return version;
  }

  function sendFile(file: File): Promise<UploadReply> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', UPDATE_UPLOAD_API);
      request.setRequestHeader('Content-Type', 'application/octet-stream');
      request.upload.onprogress = event => {
        if (!event.lengthComputable) {
          return;
        }
        deps.fileInput.progressMax = event.total;
        deps.fileInput.progressValue = event.loaded;
        const percent = Math.round((event.loaded / event.total) * 100);
        deps.fileInput.progressMessageText =
          percent < 100 ? `Uploading… ${percent}%` : 'Checking and installing…';
      };
      request.onload = () => {
        try {
          resolve(JSON.parse(request.responseText) as UploadReply);
        } catch {
          reject(new Error('The device sent an unexpected reply.'));
        }
      };
      request.onerror = () => reject(new Error('The connection to the device was lost.'));
      request.send(file);
    });
  }

  async function waitForRestart(previousVersion: string) {
    for (let attempt = 0; attempt < RESTART_POLL_ATTEMPTS; attempt += 1) {
      await new Promise(resolve => window.setTimeout(resolve, RESTART_POLL_INTERVAL_MS));
      try {
        const version = await refreshVersion();
        if (version === previousVersion) {
          notify(`The device restarted and is still on version ${version}.`, 'info');
        } else {
          notify(`Updated to version ${version}.`, 'success');
        }
        return;
      } catch {
        // Still restarting (or the phone/computer has not rejoined the device yet).
      }
    }
    notify(
      'The update was installed and the device restarted. Reconnect to the device and reload ' +
        'this page to confirm the new version.',
      'info'
    );
  }

  async function upload() {
    const file = selectedFile();
    if (!file || busy) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.bin')) {
      notify('Choose a firmware update file ending in .bin.', 'error');
      return;
    }

    busy = true;
    syncControls();
    const previousVersion = installedVersion;
    deps.fileInput.progressHidden = false;
    deps.fileInput.progressValue = 0;
    deps.fileInput.progressMessageText = 'Starting…';
    notify('Uploading. Keep this page open and the device powered.', 'info');

    try {
      const reply = await sendFile(file);
      if (reply.success !== true) {
        throw new Error(reply.message || 'The device rejected the update.');
      }
      deps.fileInput.progressMessageText = 'Installed. Restarting…';
      notify('Update installed. The device is restarting…', 'info');
      await waitForRestart(previousVersion);
    } catch (error) {
      deps.fileInput.progressHidden = true;
      notify(error instanceof Error ? error.message : 'The update failed.', 'error');
    } finally {
      busy = false;
      syncControls();
    }
  }

  function bind() {
    deps.fileInput.progressHidden = true;
    deps.fileInput.addEventListener('change', syncControls);
    deps.uploadBtn.addEventListener('click', () => {
      void upload();
    });
    syncControls();
  }

  return {
    bind,
    refreshVersion: async () => {
      try {
        await refreshVersion();
      } catch (error) {
        console.error('Firmware version check failed:', error);
        showVersion('');
      }
    },
  };
}
