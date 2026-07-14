import { AppText, Screen } from '../../src/components/ui';
import { spacing } from '../../src/theme';

export default function StatisticsScreen() {
  return (
    <Screen centered style={{ gap: spacing.sm }}>
      <AppText variant="title">Statistics</AppText>
      <AppText variant="body" color="secondary">
        The statistics experience will be implemented in a future task.
      </AppText>
    </Screen>
  );
}
