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
Not implemented yet. This folder only reserves the boundary — no engine code, no
registry, no session logic exists here.
