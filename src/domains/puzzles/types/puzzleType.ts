/**
 * `puzzles.puzzle_type` is deliberately `text`, not a database enum — 24+
 * puzzle types are on the roadmap (`src/puzzles/README.md`) and the plugin
 * architecture (`docs/Architecture/project-structure.md`) treats the
 * `src/engine/` registry, not this domain, as the runtime source of truth
 * for which types are valid. Hardcoding a union of known types here would
 * mean every new puzzle type requires a domain change — the exact coupling
 * the engine/puzzles split exists to avoid. `PuzzleType` therefore stays a
 * branded string.
 *
 * As of T-010, validity is delegated to `isRegisteredPuzzleType` — a string
 * is only a valid `PuzzleType` if some `PuzzleEngine` is actually registered
 * for it, not merely because it's non-empty. This is the domain's allowed
 * dependency on the engine (`src/domains/README.md`), never the reverse.
 */
import { isRegisteredPuzzleType } from '../../../engine';

export type PuzzleType = string & { readonly __brand: 'PuzzleType' };

export function isPuzzleType(value: unknown): value is PuzzleType {
  return isRegisteredPuzzleType(value);
}

export function toPuzzleType(value: string): PuzzleType {
  if (!isPuzzleType(value)) {
    throw new Error(`Invalid puzzle type: "${value}" has no registered puzzle engine`);
  }
  return value;
}
