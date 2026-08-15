import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BreathingCircle } from '../components/BreathingCircle';
import { CloseButton } from '../components/CloseButton';
import { PHASE_LABELS, formatElapsed, useBreathingSession } from '../lib/breathing';
import type { RootStackParamList } from '../navigation';

export function BreathingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Breathing'>>();
  const { phase, elapsedMs, start, stop } = useBreathingSession();

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <CloseButton onPress={() => navigation.goBack()} />
      <BreathingCircle />
      <Text className="mt-10 text-2xl font-medium text-body">{PHASE_LABELS[phase]}</Text>
      <Text className="mt-2 text-base text-muted">{formatElapsed(elapsedMs)}</Text>
    </View>
  );
}
