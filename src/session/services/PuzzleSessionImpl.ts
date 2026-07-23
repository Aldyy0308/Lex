/**
 * The only concrete `PuzzleSession`. Not exported from `src/session`'s
 * public surface — construct one via `createPuzzleSession` instead, which
 * is also the only place puzzle loading + engine resolution + payload
 * validation happen. This class assumes it's only ever constructed with an
 * already-validated puzzle/engine pair.
 */
import type { Puzzle } from '../../domains/puzzles';
import type { Hint, PuzzleEngine } from '../../engine';
import type { PuzzleSession } from '../interfaces/PuzzleSession';
import type { PuzzleSessionResult, PuzzleSessionSnapshot, PuzzleSessionStatus, SubmitAnswerResult } from '../models';
import { SessionClock } from '../state/SessionClock';
import { assertCompleted, assertInProgress } from '../validation/assertSessionState';

export class PuzzleSessionImpl implements PuzzleSession {
  readonly puzzleId: string;
  readonly puzzleType: string;

  private readonly clock: SessionClock;
  private status: PuzzleSessionStatus = 'in_progress';
  private completedResult: { isCorrect: boolean; normalizedAnswer: unknown } | null = null;

  constructor(
    private readonly puzzle: Puzzle,
    private readonly engine: PuzzleEngine,
    now: () => number = Date.now,
  ) {
    this.puzzleId = puzzle.id;
    this.puzzleType = puzzle.puzzleType;
    this.clock = new SessionClock(now);
  }

  getStatus(): PuzzleSessionStatus {
    return this.status;
  }

  getElapsedMs(): number {
    return this.clock.elapsedMs;
  }

  submitAnswer(rawAnswer: unknown): SubmitAnswerResult {
    assertInProgress(this.status);

    const answerValidation = this.engine.validateAnswer(rawAnswer);
    if (!answerValidation.valid) {
      return { valid: false, errors: answerValidation.errors, isCorrect: false, normalizedAnswer: null };
    }

    const checkResult = this.engine.checkAnswer(this.puzzle.content, this.puzzle.solution, rawAnswer);

    if (checkResult.isCorrect) {
      this.status = 'completed';
      this.completedResult = checkResult;
      this.clock.complete();
    }

    return {
      valid: true,
      errors: [],
      isCorrect: checkResult.isCorrect,
      normalizedAnswer: checkResult.normalizedAnswer,
    };
  }

  getHint(hintLevel: number): Hint {
    assertInProgress(this.status);
    return this.engine.getHint(this.puzzle.content, this.puzzle.solution, hintLevel);
  }

  getExplanation(): string {
    assertCompleted(this.status);
    return this.engine.generateExplanation(this.puzzle.content, this.puzzle.solution);
  }

  getResult(): PuzzleSessionResult {
    assertCompleted(this.status);
    if (!this.completedResult) {
      throw new Error('Invariant violated: session is "completed" but has no stored result');
    }
    const { isCorrect, normalizedAnswer } = this.completedResult;

    return {
      puzzleId: this.puzzleId,
      puzzleType: this.puzzleType,
      isCorrect,
      normalizedAnswer,
      elapsedMs: this.clock.elapsedMs,
      explanation: this.engine.generateExplanation(this.puzzle.content, this.puzzle.solution),
    };
  }

  getSnapshot(): PuzzleSessionSnapshot {
    const completedAt = this.clock.completedAt;
    return {
      puzzleId: this.puzzleId,
      puzzleType: this.puzzleType,
      status: this.status,
      startedAt: new Date(this.clock.startedAt).toISOString(),
      completedAt: completedAt !== null ? new Date(completedAt).toISOString() : null,
      elapsedMs: this.clock.elapsedMs,
    };
  }
}
