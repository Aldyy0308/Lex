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
No domains are implemented yet. This folder reserves the boundary agreed upon during
the architecture review. See `docs/Architecture/project-structure.md` for the full
rationale.
