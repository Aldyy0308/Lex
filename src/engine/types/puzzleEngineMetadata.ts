import type { PuzzleTypeId } from './puzzleType';

/**
 * Metadata about a puzzle *type* itself (what the registry keys on and
 * displays), not about any one puzzle instance/row — that's
 * `domains/puzzles`' `Puzzle` model's job.
 */
export interface PuzzleEngineMetadata {
  puzzleType: PuzzleTypeId;
  displayName: string;
  description: string;
}
