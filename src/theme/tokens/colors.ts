/**
 * Color palette — calm, editorial, restrained. Warm neutrals instead of pure
 * black/white, one muted accent used sparingly, never a saturated "brand blue."
 */
export type ColorPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  danger: string;
  success: string;
};

export const lightColors: ColorPalette = {
  background: '#FAF9F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F0EA',
  border: '#E4E1D9',
  textPrimary: '#1C1B1A',
  textSecondary: '#5C5952',
  textMuted: '#8C8880',
  accent: '#3A3F58',
  onAccent: '#FAF9F6',
  danger: '#8C3B3B',
  success: '#3B6B4E',
};

export const darkColors: ColorPalette = {
  background: '#15140F',
  surface: '#1E1C17',
  surfaceAlt: '#26241E',
  border: '#35322A',
  textPrimary: '#F2F0EA',
  textSecondary: '#B8B4AC',
  textMuted: '#847F76',
  accent: '#8A93B8',
  onAccent: '#15140F',
  danger: '#C97575',
  success: '#7FB394',
};
