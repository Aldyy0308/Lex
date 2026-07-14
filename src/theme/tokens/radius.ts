/**
 * Border radius scale. Soft, not rounded-pill by default — restraint over
 * playfulness.
 */
export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

export type RadiusKey = keyof typeof radius;
