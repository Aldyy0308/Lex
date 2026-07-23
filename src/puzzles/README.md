# Puzzle Implementations

Plugins — one folder per puzzle type (e.g. `common-link/`, `word-ladder-mystery/`).

> **Updated (T-010):** the answer-validation/checking/explanation/hint logic
> originally described as living here now lives in
> `src/engine/engines/<type>/` instead, as a `PuzzleEngine` implementation
> registered with `src/engine`'s registry — see `src/engine/README.md` and
> `docs/Architecture/project-structure.md`'s T-010 update for the full
> rationale. This folder is still reserved, but now scoped to **the
> renderer only** for each puzzle type — nothing here should re-implement
> validation, correctness checking, or hints once `src/engine/engines/<type>/`
> exists for that type.

## Rules that will govern this folder
- Must never contain engine responsibilities: session state, default scoring, hint
  orchestration, persistence, or answer validation/checking (that's
  `src/engine/engines/<type>/` now).
- Must never depend on a domain (`src/domains`) — a puzzle type has no idea whether
  it's being played in the Daily Challenge or Practice Mode.

## Status
No puzzle types are implemented yet (no renderers exist). `common-link`'s
non-UI logic is implemented under `src/engine/engines/commonLink/` instead.
