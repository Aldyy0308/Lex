/**
 * Typed Supabase client, wired to the validated config in `./config`.
 *
 * `auth.persistSession` is deliberately `false`: session persistence needs a
 * storage adapter (e.g. AsyncStorage, SecureStore), and choosing one is an
 * authentication concern for a future task, not this foundation. Leaving it
 * unset would make GoTrue fall back to in-memory storage with a console
 * warning; disabling it here keeps the client inert and warning-free until
 * auth is actually implemented.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { supabaseConfig } from './config';

export const supabase: SupabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
