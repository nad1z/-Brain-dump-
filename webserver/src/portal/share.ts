// Recordings and Books sections of the device's web page. On the setup hotspot they work
// directly; on the home network ("Share over WiFi" on the device) every request carries the
// four-digit PIN shown on the device's screen.
import { epubToText } from './epub';
import {
  formatWhen,
  recordingsToMarkdown,
  tagLabel,
  type RecordingSummary,
} from './exportMarkdown';
import type { CardField, StatusType, ValidatableField } from './types';

const PIN_HEADER = 'X-Share-Pin';
const PIN_STORAGE_KEY = 'braindump.sharePin';

export type ShareMode = 'setup' | 'share' | 'unavailable';

interface ShareStatus {
  success: boolean;
  mode: 'setup' | 'share';
  pin_required: boolean;
  authorized: boolean;
}

type FileUploadField = HTMLElement & {
  disabled: boolean;
  files: FileList | null;
  progressHidden: boolean;
  progressMax: number;
  progressMessageText: string;
  progressValue: number;
};

export interface ShareDom {
  signInCard: CardField;
  pinInput: ValidatableField;
  pinButton: HTMLButtonElement;
  recordingsCard: CardField;
  recordingsSummary: HTMLElement;
  recordingsList: HTMLElement;
  recordingsRefreshButton: HTMLButtonElement;
  recordingsExportButton: HTMLButtonElement;
  booksCard: CardField;
  booksList: HTMLElement;
  bookFileInput: FileUploadField;
  bookUploadButton: HTMLButtonElement;
}

function readStoredPin(): string {
  try {
    return sessionStorage.getItem(PIN_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function storePin(pin: string) {
  try {
    sessionStorage.setItem(PIN_STORAGE_KEY, pin);
  } catch {
    // Private mode or blocked storage: the PIN is simply asked for again after a reload.
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export async function detectShareMode(): Promise<ShareMode> {
  try {
    const response = await fetch('/api/share/status', { cache: 'no-store' });
    if (!response.ok) {
      return 'unavailable';
    }
    const status = (await response.json()) as ShareStatus;
    return status.mode === 'share' ? 'share' : 'setup';
  } catch {
    return 'unavailable';
  }
}

export function createShareController(dom: ShareDom, mode: Exclude<ShareMode, 'unavailable'>) {
  let pin = mode === 'share' ? readStoredPin() : '';
  let recordings: RecordingSummary[] = [];
  let busy = false;

  const headers = (): Record<string, string> => (pin ? { [PIN_HEADER]: pin } : {});

  async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(path, {
      cache: 'no-store',
      ...init,
      headers: { Accept: 'application/json', ...headers(), ...(init.headers ?? {}) },
    });
    const data = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (response.status === 401) {
      showSignIn('Enter the PIN shown on the device.');
      throw new Error(data.message || 'PIN needed.');
    }
    if (!response.ok || data.success !== true) {
      throw new Error(data.message || 'The device could not do that.');
    }
    return data as T;
  }

  function showSignIn(message = '') {
    dom.signInCard.hidden = false;
    dom.recordingsCard.hidden = true;
    dom.booksCard.hidden = true;
    dom.signInCard.setNotification(message, message ? 'error' : 'info');
    dom.pinInput.focus();
  }

  function showContent() {
    dom.signInCard.hidden = true;
    dom.recordingsCard.hidden = false;
    dom.booksCard.hidden = false;
  }

  function renderRecordings() {
    dom.recordingsList.replaceChildren();
    const count = recordings.length;
    dom.recordingsSummary.textContent =
      count === 0 ? 'No recordings yet.' : `${count} recording${count === 1 ? '' : 's'}, newest first.`;
    dom.recordingsExportButton.disabled = count === 0;
    for (const recording of [...recordings].sort((a, b) => b.created - a.created)) {
      const item = document.createElement('li');
      item.className = 'share-item';

      const heading = document.createElement('div');
      heading.className = 'share-item__heading';
      const title = document.createElement('strong');
      title.textContent = recording.title || tagLabel(recording.tag);
      const meta = document.createElement('span');
      meta.className = 'share-item__meta';
      const due = recording.due ? ` · due ${recording.due.replace('T', ' ')}` : '';
      meta.textContent = `${formatWhen(recording)} · ${tagLabel(recording.tag)}${due}`;
      heading.append(title, meta);

      const body = document.createElement('p');
      body.className = 'share-item__body';
      body.dir = 'auto';  // Hebrew transcripts read right to left
      body.textContent = recording.transcript.trim()
        || (recording.pending_transcription ? 'Waiting for a transcript.' : 'No transcript.');

      item.append(heading, body);
      if (recording.has_audio) {
        const audio = document.createElement('button');
        audio.type = 'button';
        audio.className = 'share-item__action';
        audio.textContent = 'Download audio';
        audio.addEventListener('click', () => void downloadAudio(recording, audio));
        item.append(audio);
      }
      dom.recordingsList.append(item);
    }
  }

  async function downloadAudio(recording: RecordingSummary, button: HTMLButtonElement) {
    button.disabled = true;
    button.textContent = 'Downloading…';
    try {
      const response = await fetch(`/api/recordings/audio?id=${encodeURIComponent(recording.id)}`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('The device could not send this recording.');
      }
      saveBlob(await response.blob(), `${recording.id}.wav`);
    } catch (error) {
      dom.recordingsCard.setNotification(error instanceof Error ? error.message : 'Download failed.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Download audio';
    }
  }

  async function loadRecordings() {
    dom.recordingsRefreshButton.disabled = true;
    try {
      const data = await api<{ recordings: RecordingSummary[] }>('/api/recordings');
      recordings = data.recordings ?? [];
      dom.recordingsCard.setNotification('');
      renderRecordings();
    } catch (error) {
      dom.recordingsCard.setNotification(error instanceof Error ? error.message : 'Could not load recordings.', 'error');
    } finally {
      dom.recordingsRefreshButton.disabled = false;
    }
  }

  function exportMarkdown() {
    const now = new Date();
    const stamp = now.toISOString().slice(0, 10);
    const markdown = recordingsToMarkdown(recordings, now);
    saveBlob(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }), `brain-dump-${stamp}.md`);
  }

  async function loadBooks() {
    try {
      const data = await api<{ books: { name: string; size: number }[] }>('/api/books');
      dom.booksList.replaceChildren();
      if ((data.books ?? []).length === 0) {
        const empty = document.createElement('li');
        empty.className = 'share-item__meta';
        empty.textContent = 'No books on the device yet.';
        dom.booksList.append(empty);
      }
      for (const book of data.books ?? []) {
        const item = document.createElement('li');
        item.className = 'share-item share-item--row';
        const name = document.createElement('span');
        name.dir = 'auto';
        name.textContent = `${book.name} (${formatSize(book.size)})`;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'share-item__action';
        remove.textContent = 'Delete';
        remove.addEventListener('click', () => void deleteBook(book.name));
        item.append(name, remove);
        dom.booksList.append(item);
      }
    } catch (error) {
      dom.booksCard.setNotification(error instanceof Error ? error.message : 'Could not load books.', 'error');
    }
  }

  async function deleteBook(name: string) {
    if (!window.confirm(`Delete "${name}" from the device?`)) {
      return;
    }
    try {
      await api(`/api/books?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
      dom.booksCard.setNotification(`Deleted ${name}.`, 'success');
      await loadBooks();
    } catch (error) {
      dom.booksCard.setNotification(error instanceof Error ? error.message : 'Delete failed.', 'error');
    }
  }

  function sendBook(name: string, text: Blob): Promise<{ success?: boolean; message?: string; name?: string }> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', `/api/books?name=${encodeURIComponent(name)}`);
      request.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
      if (pin) {
        request.setRequestHeader(PIN_HEADER, pin);
      }
      request.upload.onprogress = event => {
        if (event.lengthComputable) {
          dom.bookFileInput.progressMax = event.total;
          dom.bookFileInput.progressValue = event.loaded;
          dom.bookFileInput.progressMessageText = `Sending… ${Math.round((event.loaded / event.total) * 100)}%`;
        }
      };
      request.onload = () => {
        try {
          resolve(JSON.parse(request.responseText));
        } catch {
          reject(new Error('The device sent an unexpected reply.'));
        }
      };
      request.onerror = () => reject(new Error('The connection to the device was lost.'));
      request.send(text);
    });
  }

  function notify(message: string, type: StatusType = 'info') {
    dom.booksCard.setNotification(message, type);
  }

  async function uploadBook() {
    const file = dom.bookFileInput.files?.[0];
    if (!file || busy) {
      return;
    }
    busy = true;
    dom.bookUploadButton.disabled = true;
    dom.bookFileInput.progressHidden = false;
    dom.bookFileInput.progressValue = 0;
    try {
      let text: Blob;
      if (file.name.toLowerCase().endsWith('.epub')) {
        dom.bookFileInput.progressMessageText = 'Converting EPUB to text…';
        const book = await epubToText(await file.arrayBuffer());
        text = new Blob([book.text], { type: 'text/plain;charset=utf-8' });
      } else if (file.name.toLowerCase().endsWith('.txt')) {
        text = file;
      } else {
        throw new Error('Choose a .txt or .epub file.');
      }
      const reply = await sendBook(file.name, text);
      if (reply.success !== true) {
        throw new Error(reply.message || 'The device did not accept the book.');
      }
      notify(`Added ${reply.name ?? file.name}. Find it under Books on the device.`, 'success');
      await loadBooks();
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Adding the book failed.', 'error');
    } finally {
      busy = false;
      dom.bookUploadButton.disabled = !dom.bookFileInput.files?.length;
      dom.bookFileInput.progressHidden = true;
    }
  }

  async function signIn() {
    const entered = dom.pinInput.value.trim();
    if (!/^\d{4}$/.test(entered)) {
      dom.signInCard.setNotification('The PIN is the four digits on the device screen.', 'error');
      return;
    }
    pin = entered;
    try {
      const response = await fetch('/api/share/status', { cache: 'no-store', headers: headers() });
      const status = (await response.json()) as ShareStatus;
      if (!status.authorized) {
        throw new Error('That PIN is not right. Check the device screen.');
      }
      storePin(pin);
      showContent();
      await Promise.allSettled([loadRecordings(), loadBooks()]);
    } catch (error) {
      pin = '';
      dom.signInCard.setNotification(error instanceof Error ? error.message : 'Could not sign in.', 'error');
    }
  }

  async function start() {
    dom.bookFileInput.progressHidden = true;
    dom.bookUploadButton.disabled = true;
    dom.bookFileInput.addEventListener('change', () => {
      dom.bookUploadButton.disabled = busy || !dom.bookFileInput.files?.length;
    });
    dom.bookUploadButton.addEventListener('click', () => void uploadBook());
    dom.recordingsRefreshButton.addEventListener('click', () => void loadRecordings());
    dom.recordingsExportButton.addEventListener('click', exportMarkdown);
    dom.pinButton.addEventListener('click', () => void signIn());
    dom.pinInput.addEventListener('keydown', event => {
      if ((event as KeyboardEvent).key === 'Enter') {
        void signIn();
      }
    });

    if (mode === 'share' && !pin) {
      showSignIn();
      return;
    }
    showContent();
    await Promise.allSettled([loadRecordings(), loadBooks()]);
  }

  return { start };
}
