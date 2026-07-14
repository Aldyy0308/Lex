import { View } from 'react-native';

import { AppText, Button, Card, Screen } from '../../src/components/ui';
import { getGreeting } from '../../src/lib/greeting';
import { spacing } from '../../src/theme';

type StatItemProps = {
  label: string;
  value: string;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
      <AppText variant="heading">{value}</AppText>
    </View>
  );
}

export default function HomeScreen() {
  const greeting = getGreeting();

  return (
    <Screen scroll style={{ gap: spacing.xl }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="title">{greeting}</AppText>
        <AppText variant="body" color="secondary">
          🔥 17 Day Streak
        </AppText>
      </View>

      <Card elevation="medium" style={{ gap: spacing.lg, padding: spacing.xl }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="heading">Today&rsquo;s Brain Workout</AppText>
          <AppText variant="bodySmall" color="secondary">
            5 puzzles · about 6 minutes · +120 XP reward
          </AppText>
        </View>
        <Button
          label="Start Today's Challenge"
          variant="primary"
          style={{ width: '100%', paddingVertical: spacing.md }}
        />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="heading">Practice</AppText>
          <AppText variant="bodySmall" color="secondary">
            Sharpen a specific skill with a short, untimed set — no streak
            pressure, just focused reps.
          </AppText>
        </View>
        <Button label="Start Practice" variant="secondary" />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <AppText variant="heading">Your Progress</AppText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <StatItem label="Current Level" value="Level 4" />
          <StatItem label="Today's XP" value="40 XP" />
          <StatItem label="Accuracy" value="82%" />
        </View>
      </Card>

      <Card style={{ gap: spacing.xs }}>
        <AppText variant="heading">Collections</AppText>
        <AppText variant="bodySmall" color="muted">
          Coming Soon
        </AppText>
      </Card>
    </Screen>
  );
}
