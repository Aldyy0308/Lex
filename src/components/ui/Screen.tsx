import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';

export type ScreenProps = {
  children: ReactNode;
  style?: ViewStyle;
  centered?: boolean;
  scroll?: boolean;
};

export function Screen({ children, style, centered = false, scroll = false }: ScreenProps) {
  const theme = useTheme();
  const contentStyle = [
    { padding: theme.spacing.lg },
    scroll ? styles.grow : styles.flex,
    centered && styles.centered,
    style,
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={contentStyle}>{children}</ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
