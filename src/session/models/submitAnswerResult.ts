/**
 * `valid`/`errors` report the engine's `validateAnswer` (shape) check;
 * `isCorrect`/`normalizedAnswer` report `checkAnswer` (correctness) — kept
 * as one result rather than two, since a caller submitting an answer wants
 * both outcomes in a single round trip. `isCorrect`/`normalizedAnswer` are
 * only meaningful when `valid` is `true` (a shape-invalid answer was never
 * checked for correctness).
 */
export interface SubmitAnswerResult {
  valid: boolean;
  errors: string[];
  isCorrect: boolean;
  normalizedAnswer: unknown;
}
