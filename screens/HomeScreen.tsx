// Initial route. Renders synchronously with no data dependency — nothing
// here reads AsyncStorage or waits on the IAP connection, so the Start
// button is tappable on the very first frame. See PROJECT.md.
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="mb-2 text-center text-3xl font-semibold text-body">
        Right now, you&apos;re safe.
      </Text>
      <Text className="mb-12 text-center text-base text-muted">
        A guided breathing exercise can help this pass.
      </Text>

      <Pressable
        onPress={() => navigation.navigate('Breathing')}
        accessibilityRole="button"
        accessibilityLabel="Start guided breathing"
        className="h-40 w-40 items-center justify-center rounded-full bg-accent active:opacity-80"
      >
        <Text className="text-xl font-semibold text-white">Start</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Grounding')} className="mt-10">
        <Text className="text-base text-muted underline">Try a grounding exercise instead</Text>
      </Pressable>

      <View className="absolute bottom-10 flex-row gap-8">
        <Pressable onPress={() => navigation.navigate('Log')} accessibilityRole="button">
          <Text className="text-sm text-muted">Log</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Settings')} accessibilityRole="button">
          <Text className="text-sm text-muted">Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}
