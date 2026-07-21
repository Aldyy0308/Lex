/**
 * Typed Supabase client, wired to the validated config in `./config`.
 *
 * `auth.storage` uses `@react-native-async-storage/async-storage` — the
 * adapter Supabase's own React Native quickstart recommends. The other
 * option researched in T-006 (`expo-sqlite`'s `localStorage` polyfill) was
 * rejected here because it pulls in a SQLite dependency for a job that's
 * just key/value storage of a JWT pair, and AsyncStorage has no known size
 * limit that would risk truncating a session (unlike `expo-secure-store`,
 * which caps values at 2048 bytes on Android and can't reliably hold a
 * Supabase session without chunking).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { supabaseConfig } from './config';

export const supabase: SupabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// GoTrue's token auto-refresh timer only runs while something calls it;
// on native there's no browser tab visibility to drive that automatically,
// so it must be started/stopped in step with the app's foreground state —
// otherwise a session silently goes stale while the app is backgrounded.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
