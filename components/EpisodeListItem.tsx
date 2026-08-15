import React from 'react';
import { Text, View } from 'react-native';

import { TRIGGER_TAGS } from '../lib/constants';
import type { EpisodeLogEntry } from '../types';

function triggerLabel(tag: EpisodeLogEntry['triggerTag']): string | undefined {
  return TRIGGER_TAGS.find((t) => t.value === tag)?.label;
}

export function EpisodeListItem({ entry }: { entry: EpisodeLogEntry }) {
  const date = new Date(entry.loggedAt);
  const label = triggerLabel(entry.triggerTag);
  const subtitle = [label, entry.durationMinutes ? `${entry.durationMinutes} min` : undefined]
    .filter(Boolean)
    .join(' · ');

  return (
    <View className="border-b border-hairline py-3">
      <Text className="text-body">
        {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      {subtitle.length > 0 && <Text className="text-sm text-muted">{subtitle}</Text>}
    </View>
  );
}
