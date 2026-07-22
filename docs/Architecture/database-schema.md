# LexIQ — Database Schema (Supabase/Postgres)

**Status as of this document:** the initial schema exists —
`supabase/migrations/`, six tables, no repositories, no UI wiring. This is the
data layer `src/services/supabase/` will grow query repositories against next;
nothing in `src/domains/` reads from it yet.

---

## 1. Executive Summary

**What was built:** seven migrations under `supabase/migrations/` creating
`profiles`, `puzzles`, `daily_challenges`, `puzzle_attempts`, `xp_transactions`,
and `streaks`, plus a shared `set_updated_at()` trigger function and a
`handle_new_user()` trigger that provisions a `profiles` + `streaks` row the
moment Supabase Auth creates a user. Every table has Row Level Security
enabled with policies scoped to `auth.uid()`.

**Why it was built:** T-007 introduced Auth with nothing for a signed-in user
to actually own yet. This is the schema those future domains (Daily Challenge,
Practice, Progression, Statistics) will read and write once their
repositories exist — modeled after the *domain*, per the Product Vision
(puzzle engine lifecycle in `src/engine/README.md`), not after any current
screen.

**Files involved:**
- `supabase/migrations/20260722103000_create_updated_at_trigger_function.sql`
- `supabase/migrations/20260722103100_create_profiles.sql`
- `supabase/migrations/20260722103200_create_puzzles.sql`
- `supabase/migrations/20260722103300_create_daily_challenges.sql`
- `supabase/migrations/20260722103400_create_puzzle_attempts.sql`
- `supabase/migrations/20260722103500_create_xp_transactions.sql`
- `supabase/migrations/20260722103600_create_streaks.sql`

**Explicitly deferred:** repositories (`src/services/supabase/*Repository.ts`),
any domain code reading these tables, seed data, API endpoints, and any
business logic that computes XP/level/streak values. This pass is schema
only.

---

## 2. Schema Walkthrough

### `profiles`
One row per `auth.users` row (1:1, same `id`, `on delete cascade`). Holds the
public identity (`username`, `display_name`, `avatar_url`) and a **denormalized
cache** — `total_xp`, `current_level` — for fast reads (profile screen, future
leaderboards). `username` is nullable and unique (current sign-up flow only
collects email/password; a username is set later, so it can't be `not null`
yet without inventing a collision-prone default).

### `puzzles`
The catalog, shared by every puzzle type from `src/puzzles/`. `puzzle_type` is
free text and `content`/`solution` are `jsonb` — deliberately untyped at the
database level, because each puzzle type plugin owns its own content shape
(the engine/puzzles split documented in `project-structure.md`). Adding puzzle
type #25 must never require a migration.

### `daily_challenges`
Pins one `puzzle_id` to one `challenge_date` (`unique`). `on delete restrict`
on `puzzle_id` — a puzzle that's been featured shouldn't be deletable out from
under its own history.

### `puzzle_attempts`
Append-only record of one attempt at one puzzle (the engine lifecycle's
"record attempt" step). No `updated_at` — an attempt is an immutable fact, not
an editable row. `daily_challenge_id` is nullable since most attempts happen
in Practice Mode. `unique (user_id, puzzle_id, attempt_number)` enforces
sequential attempt numbering at the database level.

### `xp_transactions`
Append-only XP ledger — the source of truth `profiles.total_xp` is a cache
of. `source` is constrained to a known set of origins via `CHECK`, and
`puzzle_attempt_id` links a transaction back to the attempt that earned it
(nullable, since not every transaction originates from an attempt — e.g.
`streak_bonus`, `manual_adjustment`).

### `streaks`
One row per user (`user_id unique`). `longest_streak >= current_streak` is
enforced as a `CHECK` because it's a structural invariant of the two columns,
not a business rule about *when* a streak increments.

### Shared trigger: `handle_new_user()`
Fires `after insert on auth.users`, inserting a `profiles` row and a
`streaks` row for the new user. Every other table FKs to `profiles.id`, so
without this, sign-up would need the client to remember a follow-up insert
before anything else about that user could exist — this is provisioning
plumbing, not a business rule, which is why it's the one trigger in this
schema that goes beyond `updated_at` maintenance.

---

## 3. Design Decisions

### Decision: `total_xp`/`current_level`/streak counters are caches, not computed columns or triggers
- **Reason:** `xp_transactions` is the ledger of record. Keeping
  `profiles.total_xp` and `streaks.current_streak`/`longest_streak` in sync
  with it is a domain rule (how much XP a puzzle is worth, when a streak
  resets) that belongs to the Progression domain once it's implemented, not
  to a migration.
- **Alternatives considered:** a trigger that sums `xp_transactions` into
  `profiles.total_xp` on every insert — rejected because it would hardcode a
  business rule (that total_xp is *always* exactly the sum, with no room for
  e.g. seasonal resets) into the database before that rule has been decided.
- **Pros:** the schema doesn't have to be redesigned when the actual XP/level
  curve is decided.
- **Cons:** until the Progression domain writes the sync logic, `total_xp`
  and the ledger can drift if something writes one without the other — see
  Technical Debt below.
- **Future implications:** the Progression domain's repository is the natural
  place to keep both in sync (e.g., a single RPC that inserts the ledger row
  and updates the cache in one transaction).

### Decision: `set_updated_at()` trigger exists; XP/streak-sync triggers don't
- **Reason:** the task brief said triggers only where essential for
  correctness. An `updated_at` column that's sometimes stale because a caller
  forgot to set it is worse than not having the column — it implies a
  guarantee it doesn't keep, silently. That's pure plumbing with no domain
  meaning. Summing a ledger into a cache is a domain rule (see above), which
  is a different kind of thing.
- **Pros:** one bug class (stale `updated_at`) is closed permanently; the
  domain-rule bug class (stale `total_xp`) stays visible and owned by the
  domain that will eventually implement it.

### Decision: `puzzle_type` is `text`, not a Postgres `enum`
- **Reason:** 24+ puzzle types are on the roadmap (`src/puzzles/README.md`).
  A Postgres `enum` requires `ALTER TYPE ... ADD VALUE` (and, in older
  Postgres, can't run inside the same transaction as its use) every time a
  puzzle type is added — friction the plugin architecture is specifically
  designed to avoid elsewhere.
- **Alternatives considered:** a `puzzle_types` lookup table with an FK —
  rejected as premature normalization; nothing yet needs to query "all known
  puzzle types" as data, and the registry in `src/engine/` will be the
  runtime source of truth for what a valid type is.
- **Cons:** the database can't reject an unknown `puzzle_type` by itself;
  that validation has to happen in the engine's registry.

### Decision: RLS policies scoped to `authenticated`, not `anon`
- **Reason:** every current route is gated by `Stack.Protected` on
  `isAuthenticated` (`routing.md`) — there's no unauthenticated screen that
  needs to read puzzle data yet.
- **Future implications:** a future "browse before sign-up" flow would need
  an additional `anon` `select` policy on `puzzles`/`daily_challenges`; that's
  a pure addition, not a redesign.

---

## 4. Verification Performed

No local Postgres/Supabase CLI/Docker was preinstalled in this environment,
so migrations were verified against a **real, disposable Postgres 15
container** (via `podman`, not a static SQL lint):

1. All seven migrations applied in order with zero errors.
2. All 8 foreign keys resolve to the correct table (`pg_constraint` checked
   directly) with the intended `ON DELETE` behavior.
3. `select relrowsecurity from pg_class` confirmed RLS is enabled on all six
   tables.
4. Inserting into a stand-in `auth.users` table fired `handle_new_user()` and
   produced exactly one `profiles` row and one `streaks` row, both defaulted
   correctly (`total_xp=0`, `current_level=1`, `current_streak=0`,
   `longest_streak=0`).
5. `CHECK` constraints were exercised directly: an out-of-range `difficulty`,
   a `longest_streak < current_streak`, and a duplicate `daily_challenges
  .challenge_date` were all correctly rejected.
6. The `updated_at` trigger was confirmed to actually change the timestamp on
   `UPDATE`.
7. RLS was tested as the `authenticated` role (not the Postgres superuser,
   which bypasses RLS and would have made this check meaningless): a session
   impersonating user A was blocked from inserting a `puzzle_attempts` row
   for user B, succeeded inserting its own, and `SELECT` returned only its
   own row.
8. `npx tsc --noEmit` run against the existing app — no changes were made
   under `src/`, and the check confirms nothing regressed.

The container was removed after verification; nothing was left running.

---

## 5. Technical Debt

- **`profiles.total_xp` / `streaks.current_streak`+`longest_streak` are
  caches with no enforced sync.** Until the Progression domain writes the
  code that keeps them consistent with `xp_transactions`, nothing prevents
  them from drifting. Tracked here rather than papered over with a
  premature trigger (see Design Decisions).
- **`xp_transactions` and `puzzle_attempts` currently trust the client.**
  Their `insert` RLS policies only check `auth.uid() = user_id` — there is no
  server-side check that an inserted `amount` or `is_correct` value is
  actually correct for the referenced puzzle. This is acceptable for a
  schema-only pass with no business logic yet, but should be revisited when
  the Progression/Practice domains are implemented: the likely fix is moving
  these writes behind a `SECURITY DEFINER` Postgres function (or an Edge
  Function using the service role) that validates the attempt server-side
  instead of trusting an RLS-gated client insert.
- **No `supabase/config.toml`.** Not created, since this environment has no
  linked Supabase project and inventing one risked guessing a wrong project
  ref. The next contributor running `supabase init`/`supabase link` locally
  will generate it.

---

## 6. Key Concepts

- **Ledger vs. cache:** `xp_transactions` (append-only, source of truth) vs.
  `profiles.total_xp` (denormalized, fast-read cache). The same pattern
  recurs in `streaks`.
- **Schema-level invariants vs. business rules:** a `CHECK` constraint
  belongs in the database when it's true regardless of *why* (e.g.
  `longest_streak >= current_streak`); a rule about *when* XP is awarded or
  *how* a streak increments belongs in the domain layer instead.
- **Plugin-shaped data:** `puzzles.content`/`solution` as `jsonb` is the
  database-level counterpart to the engine/puzzles registry pattern — the
  schema doesn't know what a Common Link puzzle's content looks like, on
  purpose.

## 7. Interview & Discussion Questions

**Beginner**
- Why does `puzzle_attempts` have no `updated_at` column when `profiles`
  does?
- What would go wrong if `daily_challenges.puzzle_id` used
  `on delete cascade` instead of `on delete restrict`?

**Intermediate**
- `xp_transactions.puzzle_attempt_id` is nullable. Walk through a case where
  an XP transaction exists with no corresponding puzzle attempt.
- Why is `handle_new_user()` considered "essential for correctness" but a
  hypothetical `sync_total_xp()` trigger was deliberately not written?

**Senior**
- `profiles.total_xp` can drift from `sum(xp_transactions.amount)` today.
  Design the mechanism you'd add to close that gap — where would it live,
  and would it be a trigger, an RPC, or an Edge Function? What are the
  tradeoffs?
- The `insert` policies on `puzzle_attempts`/`xp_transactions` currently
  trust the client's `is_correct`/`amount` values. Sketch the
  `SECURITY DEFINER` function that would validate an attempt server-side
  instead, and what it would need to know about a puzzle to do so.

**Architecture-focused**
- `puzzle_type` is `text` instead of an `enum` specifically to avoid schema
  churn as puzzle types are added. What's the cost of that choice — what
  would a `text` column let through that an `enum` wouldn't, and does
  anything downstream need to guard against it?
