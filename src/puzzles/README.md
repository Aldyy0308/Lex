# Puzzle Implementations

Plugins — one folder per puzzle type (e.g. `common-link/`, `word-ladder-mystery/`).
Each implementation will register itself with the Puzzle Engine's registry and
contain only what makes that puzzle type unique: its renderer and its answer
validator (plus a scoring override only if its scoring genuinely differs from the
engine's default).

## Rules that will govern this folder
- Must never contain engine responsibilities: session state, default scoring, hint
  orchestration, persistence.
- Must never depend on a domain (`src/domains`) — a puzzle type has no idea whether
  it's being played in the Daily Challenge or Practice Mode.

## Status
No puzzle types are implemented yet.
