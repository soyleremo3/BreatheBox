import { BOX_BREATHING_PATTERN, formatElapsed, getPatternCycleMs, getPhaseAtElapsed } from './breathing';

describe('getPatternCycleMs', () => {
  it('sums the box-breathing pattern to 16 seconds', () => {
    expect(getPatternCycleMs(BOX_BREATHING_PATTERN)).toBe(16000);
  });
});

describe('getPhaseAtElapsed', () => {
  it('starts on inhale at elapsed 0', () => {
    expect(getPhaseAtElapsed(0)).toEqual({
      phase: 'inhale',
      phaseIndex: 0,
      phaseProgress: 0,
      cycleNumber: 1,
    });
  });

  it('reports progress partway through the first phase', () => {
    const result = getPhaseAtElapsed(2000);
    expect(result.phase).toBe('inhale');
    expect(result.phaseProgress).toBeCloseTo(0.5);
  });

  it('crosses into holdFull at 4000ms', () => {
    const result = getPhaseAtElapsed(4000);
    expect(result.phase).toBe('holdFull');
    expect(result.phaseIndex).toBe(1);
    expect(result.phaseProgress).toBe(0);
  });

  it('reaches exhale at 8000ms and holdEmpty at 12000ms', () => {
    expect(getPhaseAtElapsed(8000).phase).toBe('exhale');
    expect(getPhaseAtElapsed(12000).phase).toBe('holdEmpty');
  });

  it('wraps into cycle 2 at 16000ms', () => {
    const result = getPhaseAtElapsed(16000);
    expect(result.phase).toBe('inhale');
    expect(result.cycleNumber).toBe(2);
    expect(result.phaseProgress).toBe(0);
  });

  it('keeps counting cycles correctly deep into a session', () => {
    // 5 full cycles (80000ms) plus 8000ms => start of cycle 6, exhale phase.
    const result = getPhaseAtElapsed(80000 + 8000);
    expect(result.cycleNumber).toBe(6);
    expect(result.phase).toBe('exhale');
  });
});

describe('formatElapsed', () => {
  it('formats zero as 0:00', () => {
    expect(formatElapsed(0)).toBe('0:00');
  });

  it('formats sub-minute durations', () => {
    expect(formatElapsed(4000)).toBe('0:04');
  });

  it('pads seconds and rolls over minutes', () => {
    expect(formatElapsed(65000)).toBe('1:05');
  });

  it('never returns a negative time', () => {
    expect(formatElapsed(-500)).toBe('0:00');
  });
});
