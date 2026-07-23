import type { AnswerCheckResult, Hint, PuzzleEngineMetadata, ValidationResult } from '../types';

/**
 * The contract every puzzle type plugs into the framework through. A puzzle
 * type is "just" an implementation of this interface plus a registration
 * call — the registry and everything that consumes it only ever depends on
 * this shape, never on a specific puzzle type (`docs/Architecture/
 * project-structure.md`'s engine/puzzles boundary, enforced here at the
 * type level).
 *
 * `TContent`/`TSolution`/`TAnswer` let a concrete engine (e.g.
 * `CommonLinkEngine`) work with its own typed shapes internally, while the
 * registry stores every engine under the same erased `PuzzleEngine<any, any,
 * any>` — see `registry/PuzzleEngineRegistry.ts`.
 */
export interface PuzzleEngine<TContent = unknown, TSolution = unknown, TAnswer = unknown> {
  readonly metadata: PuzzleEngineMetadata;

  /** Structural validation of a puzzle row's `content`/`solution` jsonb, before it's trusted as `TContent`/`TSolution`. */
  validatePayload(content: unknown, solution: unknown): ValidationResult;

  /** Structural validation of a raw user answer, before it's trusted as `TAnswer`. */
  validateAnswer(answer: unknown): ValidationResult;

  /** Correctness check against the solution. Assumes both payload and answer already passed validation. */
  checkAnswer(content: TContent, solution: TSolution, answer: TAnswer): AnswerCheckResult<TAnswer>;

  /** Human-readable explanation of the solution, shown after an attempt. */
  generateExplanation(content: TContent, solution: TSolution): string;

  /** `hintLevel` is 1-indexed and monotonically increasing per request. */
  getHint(content: TContent, solution: TSolution, hintLevel: number): Hint;
}
