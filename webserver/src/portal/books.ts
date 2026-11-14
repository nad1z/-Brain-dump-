import { bookFileToText, deviceBookName } from './bookText';
import { BOOKS_API, BOOKS_DELETE_API, BOOKS_UPLOAD_API } from './constants';
import type { CardField, StatusType } from './types';

type FileUploadField = HTMLElement & {
  disabled: boolean;
  files: FileList | null;
  progressHidden: boolean;
  progressMax: number;
  progressMessageText: string;
  progressValue: number;
};

interface BookItem {
  name: string;
  size: number;
}

interface BooksReply {
  success?: boolean;
  message?: string;
  folder?: string;
  free_bytes?: number;
  books?: BookItem[];
}

interface BooksDeps {
  card: CardField;
  fileInput: FileUploadField;
  uploadBtn: HTMLButtonElement;
  list: HTMLElement;
  summary: HTMLElement;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function createBooksController(deps: BooksDeps) {
  let busy = false;
  let books: BookItem[] = [];

  const notify = (message: string, type: StatusType = 'info') =>
    deps.card.setNotification(message, type);

  function syncControls() {
    deps.fileInput.disabled = busy;
    deps.uploadBtn.disabled = busy || !deps.fileInput.files?.length;
  }

  function render(reply: BooksReply) {
    books = reply.books ?? [];
    deps.list.replaceChildren();
    for (const book of books) {
      const row = document.createElement('li');
      row.className = 'file-list__row';
      const label = document.createElement('span');
      label.className = 'file-list__label';
      label.textContent = book.name.replace(/\.txt$/i, '');
      const meta = document.createElement('span');
      meta.className = 'file-list__meta';
      meta.textContent = formatBytes(book.size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'file-list__action file-list__action--danger';
      remove.textContent = 'Delete';
      remove.addEventListener('click', () => void deleteBook(book.name));
      row.append(label, meta, remove);
      deps.list.append(row);
    }
    const free =
      typeof reply.free_bytes === 'number' ? ` · ${formatBytes(reply.free_bytes)} free on the card` : '';
    deps.summary.textContent =
      books.length === 0
        ? `No books yet${free}.`
        : `${books.length} book${books.length === 1 ? '' : 's'}${free}.`;
  }

  async function refresh() {
    try {
      const response = await fetch(BOOKS_API, { cache: 'no-store' });
      const reply = (await response.json()) as BooksReply;
      if (!reply.success) {
        deps.summary.textContent = reply.message ?? 'The SD card is not available.';
        deps.list.replaceChildren();
        return;
      }
      render(reply);
    } catch {
      deps.summary.textContent = 'Could not load the book list.';
    }
  }

  function sendBook(name: string, text: string, label: string): Promise<BooksReply> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', `${BOOKS_UPLOAD_API}?name=${encodeURIComponent(name)}`);
      request.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
      request.upload.onprogress = event => {
        if (!event.lengthComputable) {
          return;
        }
        deps.fileInput.progressMax = event.total;
        deps.fileInput.progressValue = event.loaded;
        const percent = Math.round((event.loaded / event.total) * 100);
        deps.fileInput.progressMessageText =
          percent < 100 ? `Sending ${label}… ${percent}%` : `Saving ${label}…`;
      };
      request.onload = () => {
        try {
          resolve(JSON.parse(request.responseText) as BooksReply);
        } catch {
          reject(new Error('The device sent an unexpected reply.'));
        }
      };
      request.onerror = () => reject(new Error('The connection to the device was lost.'));
      request.send(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    });
  }

  async function upload() {
    const files = Array.from(deps.fileInput.files ?? []);
    if (files.length === 0 || busy) {
      return;
    }
    busy = true;
    syncControls();
    deps.fileInput.progressHidden = false;
    let saved = 0;
    const problems: string[] = [];
    try {
      for (const file of files) {
        deps.fileInput.progressValue = 0;
        deps.fileInput.progressMessageText = file.name.toLowerCase().endsWith('.epub')
          ? `Converting ${file.name} to text…`
          : `Reading ${file.name}…`;
        try {
          const book = await bookFileToText(file);
          const target = deviceBookName(book.name);
          if (
            books.some(existing => existing.name === target) &&
            !window.confirm(`"${target}" is already on the device. Replace it?`)
          ) {
            continue;
          }
          const reply = await sendBook(book.name, book.text, file.name);
          if (reply.success) {
            saved += 1;
          } else {
            problems.push(`${file.name}: ${reply.message ?? 'not saved'}`);
          }
        } catch (error) {
          problems.push(error instanceof Error ? error.message : `${file.name}: failed`);
        }
      }
    } finally {
      busy = false;
      deps.fileInput.progressHidden = true;
      syncControls();
    }
    if (problems.length > 0) {
      notify(problems.join(' '), 'error');
    } else if (saved > 0) {
      notify(
        saved === 1
          ? 'Book saved. Open Books on the device to read it.'
          : `${saved} books saved. Open Books on the device to read them.`,
        'success'
      );
    }
    await refresh();
  }

  async function deleteBook(name: string) {
    if (busy || !window.confirm(`Delete "${name}" from the device?`)) {
      return;
    }
    busy = true;
    syncControls();
    try {
      const response = await fetch(`${BOOKS_DELETE_API}?name=${encodeURIComponent(name)}`, {
        method: 'POST',
      });
      const reply = (await response.json()) as BooksReply;
      notify(reply.message ?? (reply.success ? 'Deleted.' : 'Could not delete.'),
        reply.success ? 'success' : 'error');
    } catch {
      notify('Could not reach the device.', 'error');
    } finally {
      busy = false;
      syncControls();
    }
    await refresh();
  }

  function bind() {
    deps.fileInput.addEventListener('change', syncControls);
    deps.uploadBtn.addEventListener('click', () => void upload());
    deps.fileInput.progressHidden = true;
    syncControls();
    void refresh();
  }

  return { bind, refresh };
}
