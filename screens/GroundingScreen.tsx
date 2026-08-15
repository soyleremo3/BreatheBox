import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CloseButton } from '../components/CloseButton';
import { GroundingStepCard } from '../components/GroundingStepCard';
import { GROUNDING_SEQUENCE } from '../lib/grounding';
import type { RootStackParamList } from '../navigation';

export function GroundingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Grounding'>>();
  const [index, setIndex] = useState(0);
  const step = GROUNDING_SEQUENCE[index];
  const isLast = index === GROUNDING_SEQUENCE.length - 1;

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <CloseButton onPress={() => navigation.goBack()} />
      <GroundingStepCard step={step} index={index} total={GROUNDING_SEQUENCE.length} />

      <View className="mt-6 flex-row gap-1">
        {GROUNDING_SEQUENCE.map((s, i) => (
          <View
            key={s.id}
            className={`h-1.5 w-6 rounded-full ${i <= index ? 'bg-accent' : 'bg-hairline'}`}
          />
        ))}
      </View>

      <Pressable
        onPress={() => (isLast ? navigation.goBack() : setIndex((i) => i + 1))}
        className="mt-10 rounded-full bg-accent px-8 py-3"
      >
        <Text className="text-base font-medium text-white">{isLast ? 'Done' : 'Next'}</Text>
      </Pressable>
    </View>
  );
}
