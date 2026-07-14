import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, style }: ButtonProps) {
  const theme = useTheme();

  const backgroundColor = {
    primary: theme.colors.accent,
    secondary: theme.colors.surfaceAlt,
    ghost: 'transparent',
  }[variant];

  const textColor = {
    primary: 'onAccent',
    secondary: 'primary',
    ghost: 'accent',
  }[variant] as 'onAccent' | 'primary' | 'accent';

  const borderColor = variant === 'ghost' ? theme.colors.accent : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <AppText variant="body" color={textColor} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
  },
});
