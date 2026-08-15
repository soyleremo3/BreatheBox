import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { DURATION_BUCKETS_MINUTES } from '../lib/constants';

type Props = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export function DurationChips({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {DURATION_BUCKETS_MINUTES.map((minutes) => {
        const selected = value === minutes;
        return (
          <Pressable
            key={minutes}
            onPress={() => onChange(selected ? undefined : minutes)}
            className={`rounded-full border px-4 py-2 ${
              selected ? 'border-accent bg-accent' : 'border-hairline bg-surface'
            }`}
          >
            <Text className={selected ? 'text-white' : 'text-body'}>{minutes} min</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
