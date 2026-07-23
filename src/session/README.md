# Puzzle Session

The orchestration layer between the UI and the Puzzle Engine. A `PuzzleSession`
is one puzzle attempt in progress: it loads the puzzle, resolves the puzzle's
engine through the registry, and is the only thing a screen (when one exists)
talks to — screens must never import `src/engine` or call a `PuzzleEngine`
directly.

Session state (start time, completion time, correctness) lives only in memory
for the lifetime of the session object. Nothing here writes to Supabase,
awards XP, or records an attempt — that's Practice/Daily Challenge/Progression
domain work, once those exist.

## Allowed to depend on
- `src/domains/puzzles` — to load a `Puzzle` and resolve its engine
- `src/engine` — for engine-shaped types (`PuzzleEngine`, `Hint`, etc.)

## Must never depend on this folder
- `src/engine`, `src/puzzles` — the engine must stay independent of any
  orchestration layer built on top of it, same rule as `src/domains/README.md`

## Status

### `src/session/` (T-011)
- `interfaces/PuzzleSession.ts` — the UI-facing contract: `getStatus`,
  `getElapsedMs`, `submitAnswer`, `getHint`, `getExplanation`, `getResult`,
  `getSnapshot`.
- `models/` — plain data types: `PuzzleSessionStatus`
  (`'in_progress' | 'completed'`), `SubmitAnswerResult`, `PuzzleSessionResult`,
  `PuzzleSessionSnapshot`.
- `state/SessionClock.ts` — start/completion/elapsed time tracking, isolated
  from engine orchestration; takes an injectable `now()` for deterministic
  tests.
- `validation/assertSessionState.ts` — guards the session's own state machine
  (`assertInProgress`/`assertCompleted`, throwing `InvalidSessionStateError`).
  Distinct from the engine's `validatePayload`/`validateAnswer`, which
  validate puzzle-type-specific *data*, not session state.
- `services/createPuzzleSession.ts` — the only way to obtain a
  `PuzzleSession`: loads the puzzle (`PuzzleRepository`), resolves its engine
  (`resolveEngineForPuzzle`), validates the payload against that engine, and
  constructs the session already started. Throws `PuzzleNotFoundError` if the
  id doesn't resolve to a puzzle, or `InvalidPuzzlePayloadError` if the
  puzzle's `content`/`solution` don't satisfy its own engine's shape.
- `services/PuzzleSessionImpl.ts` — the only concrete `PuzzleSession`. Not
  exported publicly; always obtained via `createPuzzleSession`.

No React hooks, no UI components, no gameplay screens — those are explicitly
out of scope for this task. See
[`.learning/T-011/README.md`](../../.learning/T-011/README.md) (local, not
pushed) for the full lifecycle walkthrough and extension guide.
