import { Text, type TextProps } from 'react-native';

import { useTheme } from '../../theme';
import type { TypeScaleKey } from '../../theme';

type TextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'danger' | 'success' | 'onAccent';

export type AppTextProps = TextProps & {
  variant?: TypeScaleKey;
  color?: TextColor;
};

const colorKeyByVariant: Record<TextColor, string> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  muted: 'textMuted',
  accent: 'accent',
  danger: 'danger',
  success: 'success',
  onAccent: 'onAccent',
};

export function AppText({ variant = 'body', color = 'primary', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  const textColor = theme.colors[colorKeyByVariant[color] as keyof typeof theme.colors];

  return <Text style={[theme.typography[variant], { color: textColor }, style]} {...rest} />;
}
