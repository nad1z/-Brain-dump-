import { RECORDINGS_API, RECORDINGS_AUDIO_API } from './constants';
import type { CardField } from './types';

interface RecordingItem {
  id: string;
  created: number;
  date: string;
  time_valid: boolean;
  duration_ms: number;
  tag: string;
  title: string;
  transcript: string;
  has_audio: boolean;
  completed: boolean;
  archived: boolean;
  follow_up: boolean;
}

interface RecordingsReply {
  success?: boolean;
  message?: string;
  recordings?: RecordingItem[];
}

interface RecordingsDeps {
  card: CardField;
  list: HTMLElement;
  summary: HTMLElement;
  refreshBtn: HTMLButtonElement;
  allTranscriptsBtn: HTMLButtonElement;
}

const TAG_LABELS: Record<string, string> = { note: 'Note', task: 'Task', idea: 'Idea' };

function whenText(item: RecordingItem): string {
  if (item.time_valid && item.created > 0) {
    return new Date(item.created * 1000).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
  return item.date || 'Unknown date';
}

function durationText(ms: number): string {
  const seconds = Math.max(1, Math.round(ms / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function headline(item: RecordingItem): string {
  if (item.title) {
    return item.title;
  }
  const text = item.transcript.trim();
  if (!text) {
    return 'Not transcribed yet';
  }
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

function baseFileName(item: RecordingItem): string {
  return `${item.date || 'recording'}-${item.tag}-${item.id}`;
}

function saveText(fileName: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function transcriptDocument(item: RecordingItem): string {
  const lines = [
    `${TAG_LABELS[item.tag] ?? item.tag} · ${whenText(item)} · ${durationText(item.duration_ms)}`,
  ];
  if (item.title) {
    lines.push(item.title);
  }
  lines.push('', item.transcript.trim() || '(no transcript)');
  return lines.join('\n');
}

export function createRecordingsController(deps: RecordingsDeps) {
  let recordings: RecordingItem[] = [];

  function render() {
    deps.list.replaceChildren();
    for (const item of recordings) {
      const row = document.createElement('li');
      row.className = 'file-list__row file-list__row--stacked';

      const top = document.createElement('div');
      top.className = 'file-list__line';
      const label = document.createElement('span');
      label.className = 'file-list__label';
      label.textContent = headline(item);
      label.dir = 'auto';  // Hebrew transcripts read right to left
      top.append(label);

      const meta = document.createElement('div');
      meta.className = 'file-list__meta';
      const flags = [
        TAG_LABELS[item.tag] ?? item.tag,
        whenText(item),
        durationText(item.duration_ms),
        item.completed ? 'done' : '',
        item.follow_up ? 'follow-up' : '',
        item.archived ? 'archived' : '',
      ].filter(Boolean);
      meta.textContent = flags.join(' · ');

      const actions = document.createElement('div');
      actions.className = 'file-list__actions';
      if (item.has_audio) {
        const audio = document.createElement('a');
        audio.className = 'file-list__action';
        audio.href = `${RECORDINGS_AUDIO_API}?id=${encodeURIComponent(item.id)}`;
        audio.download = `${baseFileName(item)}.wav`;
        audio.textContent = 'Audio';
        actions.append(audio);
      }
      if (item.transcript.trim()) {
        const transcript = document.createElement('button');
        transcript.type = 'button';
        transcript.className = 'file-list__action';
        transcript.textContent = 'Transcript';
        transcript.addEventListener('click', () =>
          saveText(`${baseFileName(item)}.txt`, transcriptDocument(item))
        );
        actions.append(transcript);
      }
      row.append(top, meta, actions);
      deps.list.append(row);
    }
    const transcribed = recordings.filter(item => item.transcript.trim()).length;
    deps.summary.textContent =
      recordings.length === 0
        ? 'No recordings yet.'
        : `${recordings.length} recording${recordings.length === 1 ? '' : 's'}, newest first.`;
    deps.allTranscriptsBtn.disabled = transcribed === 0;
  }

  async function refresh() {
    deps.refreshBtn.disabled = true;
    try {
      const response = await fetch(RECORDINGS_API, { cache: 'no-store' });
      const reply = (await response.json()) as RecordingsReply;
      if (!reply.success) {
        recordings = [];
        deps.list.replaceChildren();
        deps.summary.textContent = reply.message ?? 'The SD card is not available.';
        deps.allTranscriptsBtn.disabled = true;
        return;
      }
      recordings = reply.recordings ?? [];
      render();
    } catch {
      deps.summary.textContent = 'Could not load the recordings.';
    } finally {
      deps.refreshBtn.disabled = false;
    }
  }

  function downloadAllTranscripts() {
    const parts = recordings
      .filter(item => item.transcript.trim())
      .map(item => transcriptDocument(item));
    if (parts.length === 0) {
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    saveText(`brain-dump-transcripts-${today}.txt`, parts.join('\n\n----------\n\n'));
    deps.card.setNotification(`Saved ${parts.length} transcripts in one file.`, 'success');
  }

  function bind() {
    deps.refreshBtn.addEventListener('click', () => void refresh());
    deps.allTranscriptsBtn.addEventListener('click', downloadAllTranscripts);
    deps.allTranscriptsBtn.disabled = true;
    void refresh();
  }

  return { bind, refresh };
}
