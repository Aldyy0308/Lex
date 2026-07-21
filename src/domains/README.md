# Domains

Application-level business domains — the "why" of LexIQ, expressed as one folder per
domain: Auth, Catalog, Daily Challenge, Practice, Skills, Statistics, Progression.

Each domain will eventually own its own `api/` (repository, hides Supabase),
`hooks/` (screen-facing state), `model/` (types + schemas), and `components/`
(domain-specific UI) subfolders — created when that domain is implemented, not
before.

## Allowed to depend on
- The Puzzle Engine (`src/engine`), to run puzzle sessions
- Services (`src/services`), through repositories only
- Shared UI (`src/components`) and theme

## Must never depend on this folder
- `src/engine` and `src/puzzles` — the engine and puzzle implementations must stay
  independent of any specific domain, so a puzzle type never has to know it's being
  used by Daily Challenge vs. Practice.

## Status

### `src/domains/auth/` (T-007)
The first implemented domain — Supabase Auth, foundation for gating the rest of the
app.

- `api/authRepository.ts` — the only file here allowed to import `src/services/supabase`.
  Wraps `supabase.auth` (`getSession`, `onAuthStateChange`, `signInWithPassword`,
  `signUp`, `signOut`) and normalizes Supabase's `AuthError` into a plain `Error`.
- `hooks/AuthProvider.tsx` — `AuthProvider` + `useAuth()`. Owns session state: restores
  it on mount via `getSession()`, keeps it live via `subscribeToAuthChanges`, and
  exposes `signIn`/`signUp`/`signOut` plus `isAuthenticated`/`isLoading`.
- `components/` — `WelcomeScreen`, `SignInScreen`, `SignUpScreen`. Screen-level
  implementations, composed from `src/components/ui` only; the `app/(auth)/*` route
  files just import and render these, per `routing.md`'s boundary rule.
- No `model/` — the domain re-uses Supabase's own `Session`/`User` types rather than
  duplicating them; nothing here does enough domain-specific shaping to justify a
  parallel type.

No other domains are implemented yet. See `docs/Architecture/project-structure.md` for
the full boundary rationale.
