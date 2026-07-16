import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Button, Card, Screen } from '../../src/components/ui';
import { getGreeting } from '../../src/lib/greeting';
import { spacing, useTheme } from '../../src/theme';

type StatItemProps = {
  label: string;
  value: string;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={{ gap: spacing.xs, flex: 1 }}>
      <AppText variant="overline" color="muted">
        {label}
      </AppText>
      <AppText variant="title">{value}</AppText>
    </View>
  );
}

function StatDivider() {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 1,
        alignSelf: 'stretch',
        backgroundColor: theme.colors.border,
        marginHorizontal: spacing.lg,
      }}
    />
  );
}

type SectionProps = {
  children: ReactNode;
};

function Section({ children }: SectionProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        gap: spacing.sm,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    >
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const greeting = getGreeting();

  return (
    <Screen scroll style={{ gap: spacing.xxl }}>
      <View style={{ gap: spacing.sm }}>
        <AppText variant="display">{greeting}</AppText>
        <AppText
          variant="overline"
          color="accent"
          style={{ textTransform: 'uppercase' }}
        >
          🔥 17 Day Streak
        </AppText>
      </View>

      <Card
        elevation="high"
        style={{
          gap: spacing.lg,
          padding: spacing.xxl,
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.accent,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <AppText variant="title" color="onAccent">
            Today&rsquo;s Brain Workout
          </AppText>
          <AppText variant="bodySmall" color="onAccent">
            5 puzzles · about 6 minutes · +120 XP reward
          </AppText>
        </View>
        <Button
          label="Start Today's Challenge"
          variant="secondary"
          style={{ width: '100%', paddingVertical: spacing.md }}
        />
      </Card>

      <Section>
        <AppText variant="overline" color="muted">
          Practice
        </AppText>
        <AppText variant="heading">Sharpen a Skill</AppText>
        <AppText variant="bodySmall" color="secondary">
          A short, untimed set — no streak pressure, just focused reps.
        </AppText>
        <Button label="Start Practice" variant="ghost" style={{ alignSelf: 'flex-start' }} />
      </Section>

      <Section>
        <AppText variant="overline" color="muted">
          Progress
        </AppText>
        <View style={{ flexDirection: 'row', paddingTop: spacing.xs }}>
          <StatItem label="Current Level" value="Level 4" />
          <StatDivider />
          <StatItem label="Today's XP" value="40 XP" />
          <StatDivider />
          <StatItem label="Accuracy" value="82%" />
        </View>
      </Section>

      <Section>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <AppText variant="overline" color="muted">
            Collections
          </AppText>
          <AppText variant="bodySmall" color="muted">
            Coming Soon
          </AppText>
        </View>
      </Section>
    </Screen>
  );
}
