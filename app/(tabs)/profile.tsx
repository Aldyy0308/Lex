import { AppText, Screen } from '../../src/components/ui';
import { spacing } from '../../src/theme';

export default function ProfileScreen() {
  return (
    <Screen centered style={{ gap: spacing.sm }}>
      <AppText variant="title">Profile</AppText>
      <AppText variant="body" color="secondary">
        The profile experience will be implemented in a future task.
      </AppText>
    </Screen>
  );
}
