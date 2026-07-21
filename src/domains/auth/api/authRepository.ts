/**
 * Auth repository — the only file in this domain allowed to import
 * `src/services/supabase`. Wraps `supabase.auth` calls and normalizes their
 * errors so nothing above this layer needs to know Supabase is the backend.
 */

import type { AuthError, Session } from '@supabase/supabase-js';

import { supabase } from '../../../services/supabase';

function unwrap<T extends { error: AuthError | null }>(result: T): Omit<T, 'error'> {
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}

export async function getSession(): Promise<Session | null> {
  const { data } = unwrap(await supabase.auth.getSession());
  return data.session;
}

export function subscribeToAuthChanges(callback: (session: Session | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => callback(session));

  return () => subscription.unsubscribe();
}

export async function signInWithPassword(email: string, password: string): Promise<Session | null> {
  const { data } = unwrap(await supabase.auth.signInWithPassword({ email, password }));
  return data.session;
}

export async function signUpWithPassword(email: string, password: string): Promise<Session | null> {
  const { data } = unwrap(await supabase.auth.signUp({ email, password }));
  return data.session;
}

export async function signOut(): Promise<void> {
  unwrap(await supabase.auth.signOut());
}
