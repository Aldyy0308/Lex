import { AppText, Button, Screen } from '../../src/components/ui';
import { useAuth } from '../../src/domains/auth';
import { spacing } from '../../src/theme';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  return (
    <Screen centered style={{ gap: spacing.sm }}>
      <AppText variant="title">Profile</AppText>
      <AppText variant="body" color="secondary">
        {session?.user.email}
      </AppText>
      <Button label="Sign Out" variant="ghost" onPress={signOut} style={{ marginTop: spacing.lg }} />
    </Screen>
  );
}
