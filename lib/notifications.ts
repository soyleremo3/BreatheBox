// Local scheduled notification only — no backend, no push token, no
// FCM/APNs. There is exactly one notification in this app: the optional
// daily check-in, toggled in Settings. Permission is requested only when
// the user turns the toggle on, never at launch (see PROJECT.md).
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

const DAILY_CHECKIN_ID = 'breathebox:daily-checkin';
const NOTIFICATION_CHANNEL_ID = 'daily-checkin';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: 'Daily check-in',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export type PermissionOutcome = { granted: boolean; canAskAgain: boolean };

export async function requestPermissionIfNeeded(): Promise<PermissionOutcome> {
  await ensureAndroidChannel();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return { granted: true, canAskAgain: current.canAskAgain };
  }
  if (!current.canAskAgain) {
    return { granted: false, canAskAgain: false };
  }

  const requested = await Notifications.requestPermissionsAsync();
  return { granted: requested.granted, canAskAgain: requested.canAskAgain };
}

export function openNotificationSettings(): void {
  Linking.openSettings();
}

// Same identifier every time → replaces any existing schedule instead of
// duplicating it, so changing the time is just one call, not cancel-then-schedule.
export async function scheduleDailyCheckIn(hour: number, minute: number): Promise<void> {
  await ensureAndroidChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_CHECKIN_ID,
    content: {
      title: 'Daily check-in',
      body: 'How are you feeling today?',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyCheckIn(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_CHECKIN_ID).catch(() => {});
}
