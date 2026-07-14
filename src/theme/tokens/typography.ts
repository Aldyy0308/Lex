import { Platform } from 'react-native';

/**
 * Typography-first scale. Headings use a serif for an editorial feel; body
 * text uses the platform system sans for readability. Both are system fonts
 * — no font assets to load, no font-loading dependency.
 */
export const fontFamily = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: (typeof fontWeight)[keyof typeof fontWeight];
  letterSpacing?: number;
};

export const typeScale = {
  display: {
    fontFamily: fontFamily.serif,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: fontWeight.semibold,
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: fontWeight.semibold,
  },
  heading: {
    fontFamily: fontFamily.serif,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: fontWeight.medium,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.regular,
  },
  overline: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
    letterSpacing: 1.2,
  },
} satisfies Record<string, TypeStyle>;

export type TypeScaleKey = keyof typeof typeScale;
