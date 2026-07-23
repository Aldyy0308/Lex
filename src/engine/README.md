# Puzzle Engine

The framework-agnostic core that orchestrates every puzzle's lifecycle: fetch →
render → validate → record attempt → score → award XP → store analytics → display
explanation → update progress → return to session flow.

When implemented, this folder will hold the puzzle type contract, the type registry,
session orchestration, generic validation/scoring delegation, and hint reveal
handling.

## Rules that will govern this folder
- Must never contain logic specific to a single puzzle type (no
  `if (type === 'common-link')` branching).
- Must never import Supabase, `expo-router`, or any other infrastructure — it takes
  data in and emits typed results out; persistence is the caller's job.
- Must be usable and testable without React Native running.

## Status

### Framework + reference engine (T-010)
- `interfaces/PuzzleEngine.ts` — the generic contract every puzzle type
  implements: `validatePayload`, `validateAnswer`, `checkAnswer`,
  `generateExplanation`, `getHint`, plus `metadata`.
- `registry/PuzzleEngineRegistry.ts` — `PuzzleEngineRegistry` class and the
  shared `puzzleEngineRegistry` singleton. `register()` throws
  `DuplicateEngineRegistrationError` on a repeat puzzle type; `getEngine`/
  `isRegistered`/`getRegisteredTypes` are the read side. This is the runtime
  source of truth for which puzzle types exist — see
  `docs/Architecture/database-schema.md`'s note that `puzzles.puzzle_type`
  being `text` (not an enum) relies on this registry to own validity.
- `validation/validatePuzzleType.ts` — `isRegisteredPuzzleType`, which
  queries the registry (not a plain string check). `src/domains/puzzles`
  (T-009) now delegates its `isPuzzleType` to this.
- `types/` — shared result/metadata shapes (`ValidationResult`,
  `AnswerCheckResult<TAnswer>`, `Hint`, `PuzzleEngineMetadata`,
  `PuzzleTypeId`) used across every engine.
- `common/` — logic shared *across* engines (currently
  `normalizeAnswerText`), as opposed to `engines/`, which holds logic unique
  to one puzzle type.
- `engines/commonLink/` — `CommonLinkEngine`, the reference implementation.
  Payload/answer validation and answer-checking (with normalization) are
  real; `getHint` is an intentional letter-reveal placeholder.
- `index.ts` — the single bootstrap import: registers every known engine
  (currently just `commonLinkEngine`) and re-exports the public surface.
  Adding puzzle type #2 means a new `engines/<type>/` folder plus one
  `register()` line here — nothing else in this folder changes.

**Superseded rule:** a puzzle type's answer-checking/validation logic
(originally described as living in `src/puzzles/<type>/`, see that folder's
README) now lives in `src/engine/engines/<type>/` instead, as a
`PuzzleEngine` implementation. `src/puzzles/<type>/` is still reserved, but
now scoped to the renderer only — see `docs/Architecture/
project-structure.md`'s T-010 update for the full rationale. Session
orchestration (fetch → render → validate → record → score → XP → ... →
return) and hint *design* (beyond the current placeholder) are still not
implemented.

See [`.learning/T-010/README.md`](../../.learning/T-010/README.md) (local,
not pushed) for the full design rationale and an extension guide for adding
a new puzzle type.
