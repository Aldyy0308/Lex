# Services

Infrastructure adapters — the only layer permitted to know about external systems:
Supabase, secure token storage, push notifications, analytics providers.

Domains and the engine reach infrastructure only through repositories/interfaces
defined here. This is what lets domain logic (streak rules, scoring rules) be tested
without a live backend, and what would let a backend be swapped without touching
business logic.

## Status

### `src/services/supabase/` (T-006, updated T-007)
A typed client. No query repositories yet — `src/domains/auth/api/authRepository.ts`
(T-007) is the first consumer, using `supabase.auth` only.

- `config.ts` — reads `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
  validates them at import time, and exposes `supabaseConfig`.
- `client.ts` — `supabase`, a `SupabaseClient` built from that config.
  `auth.persistSession` is `true` (T-007), backed by
  `@react-native-async-storage/async-storage` as `auth.storage` — the storage-adapter
  decision T-006 deliberately left open. AsyncStorage was chosen over
  `expo-secure-store` because a Supabase session (access + refresh token) can exceed
  SecureStore's 2048-byte-per-key limit on Android without manual chunking; AsyncStorage
  has no such ceiling. An `AppState` listener starts/stops GoTrue's auto-refresh timer
  in step with the app's foreground/background state, per Supabase's own React Native
  guidance.
- `index.ts` — public exports (`supabase`, `supabaseConfig`, `SupabaseConfig`).

No other services are implemented yet.
