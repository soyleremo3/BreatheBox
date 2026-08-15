import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import { TRIGGER_TAGS } from '../lib/constants';
import type { TriggerTag } from '../types';

type Props = {
  value: TriggerTag | undefined;
  onChange: (value: TriggerTag | undefined) => void;
};

export function TriggerTagPicker({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {TRIGGER_TAGS.map((tag) => {
        const selected = value === tag.value;
        return (
          <Pressable
            key={tag.value}
            onPress={() => onChange(selected ? undefined : tag.value)}
            className={`rounded-full border px-4 py-2 ${
              selected ? 'border-accent bg-accent' : 'border-hairline bg-surface'
            }`}
          >
            <Text className={selected ? 'text-white' : 'text-body'}>{tag.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
