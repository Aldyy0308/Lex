import { useState } from 'react';

import { AppText, Button, Screen, TextField } from '../../../components/ui';
import { spacing } from '../../../theme';
import { useAuth } from '../hooks/AuthProvider';

export function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setConfirmationMessage(null);
    setIsSubmitting(true);
    try {
      const { requiresEmailConfirmation } = await signUp(email.trim(), password);
      if (requiresEmailConfirmation) {
        setConfirmationMessage('Check your email to confirm your account before signing in.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen scroll style={{ gap: spacing.xl }}>
      <AppText variant="title">Create your account</AppText>

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
        autoComplete="password-new"
        textContentType="newPassword"
      />

      {error ? (
        <AppText variant="bodySmall" color="danger">
          {error}
        </AppText>
      ) : null}
      {confirmationMessage ? (
        <AppText variant="bodySmall" color="success">
          {confirmationMessage}
        </AppText>
      ) : null}

      <Button
        label={isSubmitting ? 'Creating Account…' : 'Create Account'}
        onPress={handleSubmit}
        disabled={isSubmitting || !email || !password}
        style={{ width: '100%' }}
      />
    </Screen>
  );
}
