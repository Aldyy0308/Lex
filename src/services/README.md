# Services

Infrastructure adapters — the only layer permitted to know about external systems:
Supabase, secure token storage, push notifications, analytics providers.

Domains and the engine reach infrastructure only through repositories/interfaces
defined here. This is what lets domain logic (streak rules, scoring rules) be tested
without a live backend, and what would let a backend be swapped without touching
business logic.

## Status

### `src/services/supabase/` (T-006)
Foundation only — a typed client, no repositories or business logic yet.

- `config.ts` — reads `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
  validates them at import time, and exposes `supabaseConfig`.
- `client.ts` — `supabase`, a `SupabaseClient` built from that config.
  `auth.persistSession` is `false`: session storage needs an adapter (AsyncStorage,
  SecureStore, ...) and picking one is an authentication decision left to the task
  that implements auth, not this one.
- `index.ts` — public exports (`supabase`, `supabaseConfig`, `SupabaseConfig`).

No other services are implemented yet.
