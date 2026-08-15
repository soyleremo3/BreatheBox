import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useEntitlement } from '../lib/entitlement';
import type { RootStackParamList } from '../navigation';

export function PaywallScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Paywall'>>();
  const { unlockProduct, purchaseUnlock, purchaseInFlight, isPro } = useEntitlement();

  useEffect(() => {
    if (isPro) navigation.goBack();
  }, [isPro, navigation]);

  const price = unlockProduct?.displayPrice ?? '…';

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="mb-2 text-2xl font-semibold text-body">Unlock BreatheBox</Text>
      <Text className="mb-8 text-center text-base text-muted">
        Unlimited episode history and export, plus more breathing patterns as they&apos;re added.
      </Text>

      <Pressable
        onPress={purchaseUnlock}
        disabled={purchaseInFlight}
        className="rounded-full bg-accent px-8 py-4"
        style={purchaseInFlight ? { opacity: 0.6 } : undefined}
      >
        <Text className="text-base font-medium text-white">
          {purchaseInFlight ? 'Processing…' : `Unlock — ${price}`}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()} className="mt-6">
        <Text className="text-muted underline">Not now</Text>
      </Pressable>
    </View>
  );
}
