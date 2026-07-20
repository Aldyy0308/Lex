/**
 * Centralized, validated Supabase configuration.
 *
 * Values are sourced from `EXPO_PUBLIC_*` environment variables so they are
 * inlined at build time by Expo/Metro. Validation runs at import time so a
 * missing or malformed value fails fast with a clear message instead of
 * surfacing as an opaque error from the Supabase client later.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

function readRequiredEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(
      `[services/supabase] Missing required environment variable "${name}". ` +
        'Define it in .env.local — see docs/CONTRIBUTING.md.',
    );
  }

  return value;
}

function readSupabaseUrl(value: string): string {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(
      `[services/supabase] EXPO_PUBLIC_SUPABASE_URL is not a valid URL: "${value}".`,
    );
  }
}

export const supabaseConfig: SupabaseConfig = {
  url: readSupabaseUrl(
    readRequiredEnvVar('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  ),
  anonKey: readRequiredEnvVar(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
};
