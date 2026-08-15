// AsyncStorage-backed CRUD for episode log entries and settings. Local-only —
// no backend, no account, no SQLite (see PROJECT.md for why).
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import type { EpisodeLogEntry, Settings } from '../types';

export async function getEpisodes(): Promise<EpisodeLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.episodes);
    return raw ? (JSON.parse(raw) as EpisodeLogEntry[]) : [];
  } catch {
    return [];
  }
}

async function saveEpisodes(episodes: EpisodeLogEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.episodes, JSON.stringify(episodes));
}

export async function addEpisode(entry: EpisodeLogEntry): Promise<void> {
  const episodes = await getEpisodes();
  episodes.push(entry);
  await saveEpisodes(episodes);
}

export async function deleteEpisode(id: string): Promise<void> {
  const episodes = await getEpisodes();
  await saveEpisodes(episodes.filter((entry) => entry.id !== id));
}

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fall through to default
  }
  return { ...DEFAULT_SETTINGS };
}

export async function updateSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}
