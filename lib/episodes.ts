// Pure helpers for the episode log: sorting, the free-tier visibility cap,
// and CSV serialization. No storage or React here — see lib/storage.ts and
// screens/LogScreen.tsx for those.
import { TRIGGER_TAGS } from './constants';
import type { EpisodeLogEntry } from '../types';

// No extra dependency (e.g. expo-crypto) needed for a locally-unique id.
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function sortEpisodesNewestFirst(episodes: EpisodeLogEntry[]): EpisodeLogEntry[] {
  return [...episodes].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  );
}

// Free tier caps *visibility*, never storage — every entry a user logs is
// always saved. Paying unlocks seeing/exporting the full history. See
// PROJECT.md for why this is a visibility gate, not a data-deletion one.
export function visibleEpisodes(
  episodes: EpisodeLogEntry[],
  isPro: boolean,
  freeLimit: number
): EpisodeLogEntry[] {
  const sorted = sortEpisodesNewestFirst(episodes);
  return isPro ? sorted : sorted.slice(0, freeLimit);
}

function triggerLabel(tag: EpisodeLogEntry['triggerTag']): string {
  if (!tag) return '';
  return TRIGGER_TAGS.find((t) => t.value === tag)?.label ?? tag;
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Framed as "share with your therapist" — a convenience export, not a
// data-loss safety net (the underlying data is never gated, only its
// visibility is — see visibleEpisodes above).
export function episodesToCsv(episodes: EpisodeLogEntry[]): string {
  const header = ['Date', 'Time', 'Trigger', 'Duration (min)'].join(',');
  const rows = sortEpisodesNewestFirst(episodes).map((entry) => {
    const date = new Date(entry.loggedAt);
    const dateStr = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
    const timeStr = Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString();
    return [
      csvEscape(dateStr),
      csvEscape(timeStr),
      csvEscape(triggerLabel(entry.triggerTag)),
      entry.durationMinutes != null ? String(entry.durationMinutes) : '',
    ].join(',');
  });
  return [header, ...rows].join('\n');
}
