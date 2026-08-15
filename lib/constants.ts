import type { TriggerTag } from '../types';

export const STORAGE_KEYS = {
  episodes: 'breathebox.episodes',
  settings: 'breathebox.settings',
  entitlement: 'breathebox.entitlement',
} as const;

export const TRIGGER_TAGS: { value: TriggerTag; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'health', label: 'Health' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'financial', label: 'Financial' },
  { value: 'unknown', label: 'Not sure' },
];

export const DURATION_BUCKETS_MINUTES = [5, 15, 30, 45] as const;

// Free tier shows/exports only the most recent N entries. Every entry a user
// logs is always saved — this caps *visibility*, never storage, so upgrading
// never requires re-entering lost history. See PROJECT.md for the reasoning.
export const FREE_TIER_VISIBLE_ENTRIES = 15;

// Must be created as a non-consumable in-app purchase in App Store Connect
// and Google Play Console before this product ID resolves to anything real.
export const PRODUCT_ID_UNLOCK = 'com.breathebox.app.unlock';

export const DEFAULT_SETTINGS = {
  dailyCheckInEnabled: false,
  dailyCheckInHour: 9,
  dailyCheckInMinute: 0,
};

export const CRISIS_RESOURCES = {
  us: { label: 'US: Call or text 988 (Suicide & Crisis Lifeline)', tel: '988' },
  international:
    'Outside the US: findahelpline.com lists crisis lines by country.',
};
