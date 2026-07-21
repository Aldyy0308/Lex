import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, Button, Screen } from '../../../components/ui';
import { spacing } from '../../../theme';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen centered style={{ gap: spacing.xxl }}>
      <View style={{ gap: spacing.sm, alignItems: 'center' }}>
        <AppText variant="display">LexIQ</AppText>
        <AppText variant="body" color="secondary" style={{ textAlign: 'center' }}>
          Daily puzzles that sharpen how you think.
        </AppText>
      </View>

      <View style={{ gap: spacing.sm, width: '100%' }}>
        <Button
          label="Sign In"
          variant="primary"
          style={{ width: '100%' }}
          onPress={() => router.push('/sign-in')}
        />
        <Button
          label="Create Account"
          variant="ghost"
          style={{ width: '100%' }}
          onPress={() => router.push('/sign-up')}
        />
      </View>
    </Screen>
  );
}
