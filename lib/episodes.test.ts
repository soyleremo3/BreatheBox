import { episodesToCsv, sortEpisodesNewestFirst, visibleEpisodes } from './episodes';
import type { EpisodeLogEntry } from '../types';

const makeEntry = (id: string, loggedAt: string, extra: Partial<EpisodeLogEntry> = {}): EpisodeLogEntry => ({
  id,
  loggedAt,
  ...extra,
});

describe('sortEpisodesNewestFirst', () => {
  it('orders entries from most recent to oldest', () => {
    const entries = [
      makeEntry('a', '2026-01-01T10:00:00.000Z'),
      makeEntry('b', '2026-01-03T10:00:00.000Z'),
      makeEntry('c', '2026-01-02T10:00:00.000Z'),
    ];
    expect(sortEpisodesNewestFirst(entries).map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the input array', () => {
    const entries = [makeEntry('a', '2026-01-01T10:00:00.000Z'), makeEntry('b', '2026-01-02T10:00:00.000Z')];
    const original = [...entries];
    sortEpisodesNewestFirst(entries);
    expect(entries).toEqual(original);
  });
});

describe('visibleEpisodes', () => {
  const entries = Array.from({ length: 20 }, (_, i) =>
    makeEntry(String(i), new Date(2026, 0, i + 1).toISOString())
  );

  it('caps free-tier visibility to the given limit', () => {
    expect(visibleEpisodes(entries, false, 15)).toHaveLength(15);
  });

  it('shows the full history for pro users', () => {
    expect(visibleEpisodes(entries, true, 15)).toHaveLength(20);
  });

  it('never mutates or deletes the underlying entries', () => {
    const before = entries.length;
    visibleEpisodes(entries, false, 15);
    expect(entries).toHaveLength(before);
  });
});

describe('episodesToCsv', () => {
  it('includes a header row and one row per entry', () => {
    const entries = [
      makeEntry('a', '2026-01-01T10:00:00.000Z'),
      makeEntry('b', '2026-01-02T10:00:00.000Z', { triggerTag: 'work', durationMinutes: 15 }),
    ];
    const csv = episodesToCsv(entries);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Date,Time,Trigger,Duration (min)');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain('Work');
    expect(lines[1]).toContain('15');
  });

  it('handles an empty log', () => {
    expect(episodesToCsv([])).toBe('Date,Time,Trigger,Duration (min)');
  });
});
