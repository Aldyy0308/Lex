import { AppText, Screen } from '../../src/components/ui';
import { spacing } from '../../src/theme';

export default function PracticeScreen() {
  return (
    <Screen centered style={{ gap: spacing.sm }}>
      <AppText variant="title">Practice</AppText>
      <AppText variant="body" color="secondary">
        The practice experience will be implemented in a future task.
      </AppText>
    </Screen>
  );
}
