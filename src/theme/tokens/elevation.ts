import type { ViewStyle } from 'react-native';

export type ElevationStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export type ElevationScale = {
  none: ElevationStyle;
  low: ElevationStyle;
  medium: ElevationStyle;
  high: ElevationStyle;
};

/**
 * Elevation as shadow tokens (iOS/web `shadow*` + Android `elevation`).
 * Restrained by design — LexIQ favors borders over heavy drop shadows.
 */
export const lightElevation: ElevationScale = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  low: { shadowColor: '#1C1B1A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  medium: { shadowColor: '#1C1B1A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  high: { shadowColor: '#1C1B1A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6 },
};

export const darkElevation: ElevationScale = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  low: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 1 },
  medium: { shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.36, shadowRadius: 10, elevation: 3 },
  high: { shadowColor: '#000000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 6 },
};
