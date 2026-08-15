// Reanimated-driven visual clock, synchronized to BOX_BREATHING_PATTERN — the
// same source of truth lib/breathing.ts's discrete phase/haptic clock uses,
// so the two can't drift out of definition even though they run on separate
// threads. Purely decorative/animated; no session state lives here.
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BOX_BREATHING_PATTERN } from '../lib/breathing';

const MIN_SCALE = 0.6;
const MAX_SCALE = 1;
const MIN_OPACITY = 0.55;
const MAX_OPACITY = 1;

export function BreathingCircle() {
  const scale = useSharedValue(MIN_SCALE);
  const opacity = useSharedValue(MIN_OPACITY);

  useEffect(() => {
    const [inhale, holdFull, exhale, holdEmpty] = BOX_BREATHING_PATTERN;
    const ease = Easing.inOut(Easing.sin);

    scale.value = withRepeat(
      withSequence(
        withTiming(MAX_SCALE, { duration: inhale.seconds * 1000, easing: ease }),
        withTiming(MAX_SCALE, { duration: holdFull.seconds * 1000 }),
        withTiming(MIN_SCALE, { duration: exhale.seconds * 1000, easing: ease }),
        withTiming(MIN_SCALE, { duration: holdEmpty.seconds * 1000 })
      ),
      -1
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(MAX_OPACITY, { duration: inhale.seconds * 1000, easing: ease }),
        withTiming(MAX_OPACITY, { duration: holdFull.seconds * 1000 }),
        withTiming(MIN_OPACITY, { duration: exhale.seconds * 1000, easing: ease }),
        withTiming(MIN_OPACITY, { duration: holdEmpty.seconds * 1000 })
      ),
      -1
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View style={animatedStyle} className="h-56 w-56 rounded-full bg-accent" />
    </View>
  );
}
