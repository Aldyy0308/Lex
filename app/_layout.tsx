import { Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from '../src/domains/auth';
import { Screen } from '../src/components/ui';
import { ThemeProvider, useTheme } from '../src/theme';

function RootNavigator() {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Screen centered>
        <ActivityIndicator color={theme.colors.accent} />
      </Screen>
    );
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
