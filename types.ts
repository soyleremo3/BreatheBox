export type TriggerTag =
  | 'work'
  | 'health'
  | 'relationships'
  | 'sleep'
  | 'financial'
  | 'unknown';

export type EpisodeLogEntry = {
  id: string;
  loggedAt: string; // ISO 8601, captured automatically at log time
  triggerTag?: TriggerTag;
  durationMinutes?: number; // preset bucket, e.g. 5, 15, 30, 45
};

export type Settings = {
  dailyCheckInEnabled: boolean;
  dailyCheckInHour: number; // 0-23, local time
  dailyCheckInMinute: number; // 0-59
};

export type Entitlement = {
  isPro: boolean;
  productId?: string;
  purchasedAt?: string; // ISO, informational only
  lastVerifiedAt?: string;
};
