import { AppText, Screen } from '../../src/components/ui';
import { spacing } from '../../src/theme';

export default function HomeScreen() {
  return (
    <Screen centered style={{ gap: spacing.sm }}>
      <AppText variant="title">Home</AppText>
      <AppText variant="body" color="secondary">
        The home experience will be implemented in a future task.
      </AppText>
    </Screen>
  );
}
