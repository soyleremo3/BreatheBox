import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CRISIS_RESOURCES } from '../lib/constants';
import { useEntitlement } from '../lib/entitlement';
import { cancelDailyCheckIn, requestPermissionIfNeeded, scheduleDailyCheckIn } from '../lib/notifications';
import { getSettings, updateSettings } from '../lib/storage';
import type { RootStackParamList } from '../navigation';
import type { Settings } from '../types';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
  const { isPro, restorePurchases } = useEntitlement();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const toggleDailyCheckIn = useCallback(
    async (enabled: boolean) => {
      if (!settings) return;
      if (enabled) {
        const { granted, canAskAgain } = await requestPermissionIfNeeded();
        if (!granted) {
          if (!canAskAgain) Linking.openSettings();
          return;
        }
        await scheduleDailyCheckIn(settings.dailyCheckInHour, settings.dailyCheckInMinute);
      } else {
        await cancelDailyCheckIn();
      }
      const next = { ...settings, dailyCheckInEnabled: enabled };
      setSettings(next);
      await updateSettings(next);
    },
    [settings]
  );

  if (!settings) return null;

  return (
    <View className="flex-1 gap-6 bg-background px-6 pt-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-base text-body">Daily check-in reminder</Text>
        <Switch value={settings.dailyCheckInEnabled} onValueChange={toggleDailyCheckIn} />
      </View>

      <View className="gap-2 border-t border-hairline pt-6">
        <Text className="text-base text-body">
          {isPro ? "You've unlocked BreatheBox." : 'Unlock unlimited log history and more.'}
        </Text>
        {isPro ? (
          <Pressable onPress={restorePurchases}>
            <Text className="text-accent underline">Restore purchases</Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={() => navigation.navigate('Paywall', { source: 'settings' })}>
              <Text className="font-medium text-accent">Unlock BreatheBox →</Text>
            </Pressable>
            <Pressable onPress={restorePurchases}>
              <Text className="text-sm text-muted underline">Restore purchases</Text>
            </Pressable>
          </>
        )}
      </View>

      <View className="gap-2 border-t border-hairline pt-6">
        <Text className="text-sm text-muted">
          BreatheBox is not a substitute for professional mental health care.
        </Text>
        <Pressable onPress={() => Linking.openURL(`tel:${CRISIS_RESOURCES.us.tel}`)}>
          <Text className="text-accent underline">{CRISIS_RESOURCES.us.label}</Text>
        </Pressable>
        <Text className="text-sm text-muted">{CRISIS_RESOURCES.international}</Text>
      </View>
    </View>
  );
}
