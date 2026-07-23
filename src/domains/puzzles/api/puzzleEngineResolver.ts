/**
 * Wires a repository-loaded `Puzzle` to the engine that knows how to run
 * its type — the "Integration" half of T-010. This is pure resolution, not
 * gameplay: nothing here renders, scores, or records an attempt.
 */
import { puzzleEngineRegistry, type PuzzleEngine } from '../../../engine';
import type { Puzzle } from '../models/Puzzle';

export function resolveEngineForPuzzle(puzzle: Puzzle): PuzzleEngine {
  const engine = puzzleEngineRegistry.getEngine(puzzle.puzzleType);
  if (!engine) {
    throw new Error(`No puzzle engine registered for puzzle type "${puzzle.puzzleType}"`);
  }
  return engine;
}
