import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import type { ElevationScale } from '../../theme';

export type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: keyof ElevationScale;
};

export function Card({ children, style, elevation = 'low' }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
        },
        theme.elevation[elevation],
        style,
      ]}
    >
      {children}
    </View>
  );
}
