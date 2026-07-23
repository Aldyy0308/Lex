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

### `src/domains/puzzles/` (T-009)
The second implemented domain — reads the `public.puzzles` table (T-008) via a
Supabase-backed repository. Data-layer only: no gameplay, XP, or daily challenge
logic lives here (that's the Puzzle Engine's and future domains' job).

- `types/database.ts` — `PuzzleRow`, the raw snake_case Supabase row shape.
- `types/puzzleType.ts` — `PuzzleType`, a branded `string` (not a literal union) —
  deliberately mirrors `puzzles.puzzle_type` being `text`, not an enum; the
  `src/engine/` registry, not this domain, is meant to be the eventual runtime
  authority on which types are valid.
- `types/difficulty.ts` — `Difficulty` (`1 | 2 | 3 | 4 | 5`), matching the
  `puzzles_difficulty_range` `CHECK` constraint, plus `DIFFICULTY_LABELS`.
- `models/Puzzle.ts` — the camelCase domain model returned by the repository.
- `validation/puzzleValidation.ts` — hand-written runtime validation
  (`validatePuzzleRow`/`validatePuzzleRows`) that doubles as the snake_case →
  camelCase mapper; rejects malformed rows rather than defaulting them.
- `api/puzzleRepository.ts` / `api/supabasePuzzleRepository.ts` — the
  `PuzzleRepository` interface (`getPuzzleById`, `getActivePuzzles`,
  `getPuzzlesByType`) and its Supabase implementation; the only file here
  allowed to import `src/services/supabase`.
- No `hooks/` — nothing yet consumes this repository from a screen, so a
  data-fetching hook has no real shape to commit to; add one when a puzzle
  browsing/session UI actually needs it.

See [`.learning/T-009/README.md`](../../.learning/T-009/README.md) (local, not
pushed) for the full design rationale.

No other domains are implemented yet. See `docs/Architecture/project-structure.md` for
the full boundary rationale.
