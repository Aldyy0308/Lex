import type { ColorPalette } from './tokens/colors';
import type { ElevationScale } from './tokens/elevation';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { typeScale } from './tokens/typography';
import { motionDuration } from './tokens/motion';

export type ColorScheme = 'light' | 'dark';

export type Theme = {
  scheme: ColorScheme;
  colors: ColorPalette;
  typography: typeof typeScale;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: ElevationScale;
  motion: typeof motionDuration;
};
