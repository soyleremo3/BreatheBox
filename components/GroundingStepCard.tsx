import React from 'react';
import { Text, View } from 'react-native';

import type { GroundingStep } from '../lib/grounding';

type Props = { step: GroundingStep; index: number; total: number };

export function GroundingStepCard({ step, index, total }: Props) {
  return (
    <View className="items-center gap-4 px-6">
      <Text className="text-sm font-medium text-muted">
        Step {index + 1} of {total}
      </Text>
      <Text className="text-center text-2xl font-semibold text-body">{step.prompt}</Text>
    </View>
  );
}
