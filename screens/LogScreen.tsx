import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Share, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DurationChips } from '../components/DurationChips';
import { EpisodeListItem } from '../components/EpisodeListItem';
import { TriggerTagPicker } from '../components/TriggerTagPicker';
import { FREE_TIER_VISIBLE_ENTRIES } from '../lib/constants';
import { useEntitlement } from '../lib/entitlement';
import { episodesToCsv, generateId, visibleEpisodes } from '../lib/episodes';
import { addEpisode, getEpisodes } from '../lib/storage';
import type { RootStackParamList } from '../navigation';
import type { EpisodeLogEntry, TriggerTag } from '../types';

export function LogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Log'>>();
  const { isPro } = useEntitlement();
  const [episodes, setEpisodes] = useState<EpisodeLogEntry[]>([]);
  const [triggerTag, setTriggerTag] = useState<TriggerTag | undefined>(undefined);
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);

  const reload = useCallback(() => {
    getEpisodes().then(setEpisodes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const logEpisode = useCallback(async () => {
    const entry: EpisodeLogEntry = {
      id: generateId(),
      loggedAt: new Date().toISOString(),
      triggerTag,
      durationMinutes,
    };
    await addEpisode(entry);
    setTriggerTag(undefined);
    setDurationMinutes(undefined);
    reload();
  }, [triggerTag, durationMinutes, reload]);

  const shown = visibleEpisodes(episodes, isPro, FREE_TIER_VISIBLE_ENTRIES);
  const hiddenCount = episodes.length - shown.length;

  const exportCsv = useCallback(() => {
    Share.share({ message: episodesToCsv(shown) });
  }, [shown]);

  return (
    <View className="flex-1 bg-background px-6 pt-4">
      <View className="mb-4 gap-3 border-b border-hairline pb-4">
        <Text className="text-sm font-medium text-muted">What triggered this? (optional)</Text>
        <TriggerTagPicker value={triggerTag} onChange={setTriggerTag} />
        <Text className="mt-2 text-sm font-medium text-muted">About how long? (optional)</Text>
        <DurationChips value={durationMinutes} onChange={setDurationMinutes} />
        <Pressable onPress={logEpisode} className="mt-2 self-start rounded-full bg-accent px-6 py-3">
          <Text className="font-medium text-white">Log this episode</Text>
        </Pressable>
      </View>

      <FlatList
        data={shown}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EpisodeListItem entry={item} />}
        ListEmptyComponent={<Text className="mt-8 text-center text-muted">No episodes logged yet.</Text>}
        ListFooterComponent={
          <View className="mt-4 gap-3 pb-8">
            {hiddenCount > 0 && (
              <Pressable onPress={() => navigation.navigate('Paywall', { source: 'log-cap' })}>
                <Text className="text-center text-accent">
                  Unlock to see {hiddenCount} more entr{hiddenCount === 1 ? 'y' : 'ies'}
                </Text>
              </Pressable>
            )}
            {shown.length > 0 && (
              <Pressable onPress={exportCsv}>
                <Text className="text-center text-muted underline">Share with your therapist</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}
