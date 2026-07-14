/**
 * Motion duration constants (ms) only — no animation implementation here.
 * LexIQ's restraint applies to motion too: fast, subtle, never decorative.
 */
export const motionDuration = {
  fast: 120,
  base: 200,
  slow: 320,
};

export type MotionDurationKey = keyof typeof motionDuration;
