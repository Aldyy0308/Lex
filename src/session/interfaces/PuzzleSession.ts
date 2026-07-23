import type { Hint } from '../../engine';
import type { PuzzleSessionResult, PuzzleSessionSnapshot, PuzzleSessionStatus, SubmitAnswerResult } from '../models';

/**
 * The UI-facing contract for a single puzzle attempt in progress. This is
 * the boundary a screen would eventually be written against — it never
 * exposes the underlying `Puzzle` domain model or `PuzzleEngine` directly,
 * so a screen (when one exists) can't reach past the session into the
 * engine layer, per this task's "the UI should never communicate directly
 * with puzzle engines."
 */
export interface PuzzleSession {
  readonly puzzleId: string;
  readonly puzzleType: string;

  getStatus(): PuzzleSessionStatus;

  /** Milliseconds since the session started; frozen once completed. */
  getElapsedMs(): number;

  /** Validates, then (if valid) checks correctness. Completes the session on a correct answer. */
  submitAnswer(rawAnswer: unknown): SubmitAnswerResult;

  /** Throws `InvalidSessionStateError` once the session has completed. */
  getHint(hintLevel: number): Hint;

  /** Throws `InvalidSessionStateError` until the session has completed. */
  getExplanation(): string;

  /** Throws `InvalidSessionStateError` until the session has completed. */
  getResult(): PuzzleSessionResult;

  /** A plain-data view of current session state — see `PuzzleSessionSnapshot`. */
  getSnapshot(): PuzzleSessionSnapshot;
}
