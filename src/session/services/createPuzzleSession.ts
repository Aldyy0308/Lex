/**
 * The only way to obtain a `PuzzleSession`. Owns the three steps that must
 * happen before any puzzle can be attempted: load the row (Puzzle domain),
 * resolve its engine (Puzzle Engine registry, via the domain's own
 * resolver), and validate the row's payload against that engine — a
 * generically-shaped `Puzzle.content`/`solution` (T-009) is not guaranteed
 * to satisfy any *specific* engine's shape (T-010) until this check runs.
 */
import { resolveEngineForPuzzle, supabasePuzzleRepository } from '../../domains/puzzles';
import type { PuzzleRepository } from '../../domains/puzzles';
import type { PuzzleSession } from '../interfaces/PuzzleSession';
import { InvalidPuzzlePayloadError, PuzzleNotFoundError } from './errors';
import { PuzzleSessionImpl } from './PuzzleSessionImpl';

export async function createPuzzleSession(
  puzzleId: string,
  repository: PuzzleRepository = supabasePuzzleRepository,
  now: () => number = Date.now,
): Promise<PuzzleSession> {
  const puzzle = await repository.getPuzzleById(puzzleId);
  if (!puzzle) {
    throw new PuzzleNotFoundError(puzzleId);
  }

  const engine = resolveEngineForPuzzle(puzzle);

  const payloadValidation = engine.validatePayload(puzzle.content, puzzle.solution);
  if (!payloadValidation.valid) {
    throw new InvalidPuzzlePayloadError(puzzle.id, payloadValidation.errors);
  }

  return new PuzzleSessionImpl(puzzle, engine, now);
}
