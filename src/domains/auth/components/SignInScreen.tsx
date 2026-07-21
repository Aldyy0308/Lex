import { useState } from 'react';

import { AppText, Button, Screen, TextField } from '../../../components/ui';
import { spacing } from '../../../theme';
import { useAuth } from '../hooks/AuthProvider';

export function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen scroll style={{ gap: spacing.xl }}>
      <AppText variant="title">Welcome back</AppText>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
      />

      {error ? (
        <AppText variant="bodySmall" color="danger">
          {error}
        </AppText>
      ) : null}

      <Button
        label={isSubmitting ? 'Signing In…' : 'Sign In'}
        onPress={handleSubmit}
        disabled={isSubmitting || !email || !password}
        style={{ width: '100%' }}
      />
    </Screen>
  );
}
