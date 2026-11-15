// Turns the device's recordings into one Markdown file that drops straight into an Obsidian
// vault: newest first, tasks as checkboxes with the Tasks plugin's due-date marker.

export interface RecordingSummary {
  id: string;
  created: number;
  time_valid: boolean;
  date: string;
  duration_ms: number;
  tag: string;
  title: string;
  due: string;
  completed: boolean;
  follow_up: boolean;
  pending_transcription: boolean;
  has_audio: boolean;
  transcript: string;
}

const TAG_LABELS: Record<string, string> = { note: 'Note', task: 'Task', idea: 'Idea' };

export function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? 'Note';
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

// "2026-11-14 17:05" in the viewer's local time, or the stored date when the clock was unset.
export function formatWhen(recording: RecordingSummary): string {
  if (recording.time_valid && recording.created > 0) {
    const d = new Date(recording.created * 1000);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return recording.date || 'Unknown date';
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function recordingsToMarkdown(recordings: RecordingSummary[], exportedAt: Date): string {
  const sorted = [...recordings].sort((a, b) => b.created - a.created);
  const lines: string[] = [
    '---',
    'source: Brain Dump',
    `exported: ${exportedAt.toISOString()}`,
    `recordings: ${sorted.length}`,
    '---',
    '',
    '# Brain Dump',
    '',
  ];
  for (const recording of sorted) {
    const title = oneLine(recording.title) || tagLabel(recording.tag);
    lines.push(`## ${formatWhen(recording)} · ${tagLabel(recording.tag)} · ${title}`, '');
    const transcript = recording.transcript.trim();
    const body = transcript
      ? transcript
      : recording.pending_transcription
        ? '_Waiting for a transcript._'
        : '_No transcript (audio only)._';
    if (recording.tag === 'task') {
      const due = recording.due ? ` 📅 ${recording.due.slice(0, 10)}` : '';
      const time = recording.due.length > 10 ? ` ${recording.due.slice(11)}` : '';
      lines.push(`- [${recording.completed ? 'x' : ' '}] ${oneLine(body)}${due}${time}`);
    } else {
      lines.push(body);
    }
    if (recording.follow_up) {
      lines.push('', '#follow-up');
    }
    lines.push('');
  }
  return lines.join('\n');
}
