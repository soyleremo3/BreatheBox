// Box-breathing timing engine. Pure phase/timer math lives here, fully
// unit-testable without rendering anything (see breathing.test.ts). The
// stateful useBreathingSession() hook below drives the actual session —
// it schedules one setTimeout per phase boundary (4 per 16s cycle), not a
// polling interval, and pairs each boundary with one haptic pulse. The
// animated visual (BreathingCircle) reads BOX_BREATHING_PATTERN separately
// and drives its own Reanimated loop off the same durations, so the two
// clocks can't drift out of definition even though they run on different
// threads.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

export type BreathPhase = 'inhale' | 'holdFull' | 'exhale' | 'holdEmpty';

export type BreathingPatternStep = { phase: BreathPhase; seconds: number };

export const BOX_BREATHING_PATTERN: BreathingPatternStep[] = [
  { phase: 'inhale', seconds: 4 },
  { phase: 'holdFull', seconds: 4 },
  { phase: 'exhale', seconds: 4 },
  { phase: 'holdEmpty', seconds: 4 },
];

export const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe in',
  holdFull: 'Hold',
  exhale: 'Breathe out',
  holdEmpty: 'Hold',
};

export type PhaseAtElapsed = {
  phase: BreathPhase;
  phaseIndex: number;
  phaseProgress: number; // 0-1 through the current phase
  cycleNumber: number; // 1-indexed
};

export function getPatternCycleMs(
  pattern: BreathingPatternStep[] = BOX_BREATHING_PATTERN
): number {
  return pattern.reduce((sum, step) => sum + step.seconds * 1000, 0);
}

export function getPhaseAtElapsed(
  elapsedMs: number,
  pattern: BreathingPatternStep[] = BOX_BREATHING_PATTERN
): PhaseAtElapsed {
  const cycleMs = getPatternCycleMs(pattern);
  if (cycleMs <= 0 || elapsedMs < 0 || pattern.length === 0) {
    return { phase: pattern[0].phase, phaseIndex: 0, phaseProgress: 0, cycleNumber: 1 };
  }

  const cycleNumber = Math.floor(elapsedMs / cycleMs) + 1;
  let remainder = elapsedMs % cycleMs;

  for (let i = 0; i < pattern.length; i++) {
    const stepMs = pattern[i].seconds * 1000;
    if (remainder < stepMs) {
      return {
        phase: pattern[i].phase,
        phaseIndex: i,
        phaseProgress: stepMs === 0 ? 0 : remainder / stepMs,
        cycleNumber,
      };
    }
    remainder -= stepMs;
  }

  const lastIndex = pattern.length - 1;
  return { phase: pattern[lastIndex].phase, phaseIndex: lastIndex, phaseProgress: 1, cycleNumber };
}

export function formatElapsed(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export type BreathingSessionState = PhaseAtElapsed & { elapsedMs: number };

const MIN_TIMEOUT_MS = 16;

export function useBreathingSession(pattern: BreathingPatternStep[] = BOX_BREATHING_PATTERN) {
  const [state, setState] = useState<BreathingSessionState>({
    phase: pattern[0].phase,
    phaseIndex: 0,
    phaseProgress: 0,
    cycleNumber: 1,
    elapsedMs: 0,
  });
  const sessionStartRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Named function expression so the recursive setTimeout call refers to
  // `tickImpl` (available immediately, by JS's own name-binding rules) rather
  // than the outer `tick` const, which isn't assigned until useCallback returns.
  const tick = useCallback(function tickImpl() {
    if (sessionStartRef.current === null) return;
    const elapsedMs = Date.now() - sessionStartRef.current;
    const next = getPhaseAtElapsed(elapsedMs, pattern);
    setState({ ...next, elapsedMs });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const stepMs = pattern[next.phaseIndex].seconds * 1000;
    const msIntoStep = stepMs * next.phaseProgress;
    const msUntilNextPhase = Math.max(MIN_TIMEOUT_MS, stepMs - msIntoStep);
    timeoutRef.current = setTimeout(tickImpl, msUntilNextPhase);
  }, [pattern]);

  const start = useCallback(() => {
    sessionStartRef.current = Date.now();
    clearPending();
    tick();
  }, [clearPending, tick]);

  const stop = useCallback(() => {
    clearPending();
    sessionStartRef.current = null;
  }, [clearPending]);

  useEffect(() => stop, [stop]);

  return { ...state, start, stop };
}
