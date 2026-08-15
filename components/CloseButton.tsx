import React from 'react';
import { Pressable, Text } from 'react-native';

// Large, always-visible session-exit control — someone mid-panic-attack may
// be shaky, so this deliberately does not rely on the native header
// back-chevron alone.
export function CloseButton({ onPress, label = 'Done' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="absolute right-4 top-14 h-11 w-11 items-center justify-center rounded-full bg-surface-2"
    >
      <Text className="text-lg text-body">✕</Text>
    </Pressable>
  );
}
