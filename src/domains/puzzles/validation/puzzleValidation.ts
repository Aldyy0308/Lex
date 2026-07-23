/**
 * Runtime validation for data crossing the Supabase boundary. Nothing here
 * enforces business rules (e.g. XP curves, scoring) — only that a row is
 * shaped the way `public.puzzles` guarantees it to be, per
 * `docs/Architecture/database-schema.md`. Invalid rows are rejected rather
 * than passed through with defaults, so a schema drift surfaces immediately
 * instead of silently corrupting a puzzle session.
 *
 * As of T-010, `"puzzle_type"` validity (via `isPuzzleType`) is checked
 * against the engine registry, not just "is it a non-empty string" — a row
 * naming a puzzle type with no registered `PuzzleEngine` is now rejected
 * here too, not just deferred to whatever tries to run the puzzle later.
 */
import type { Puzzle } from '../models/Puzzle';
import { isDifficulty } from '../types/difficulty';
import { isPuzzleType } from '../types/puzzleType';

export class PuzzleValidationError extends Error {
  constructor(reason: string, row: unknown) {
    super(`[domains/puzzles] Invalid puzzle data: ${reason}`);
    this.name = 'PuzzleValidationError';
    this.cause = row;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validatePuzzleRow(row: unknown): Puzzle {
  if (!isPlainObject(row)) {
    throw new PuzzleValidationError('row is not an object', row);
  }

  if (!isNonEmptyString(row.id)) {
    throw new PuzzleValidationError('"id" must be a non-empty string', row);
  }
  if (!isPuzzleType(row.puzzle_type)) {
    throw new PuzzleValidationError('"puzzle_type" must be a puzzle type with a registered engine', row);
  }
  if (!isDifficulty(row.difficulty)) {
    throw new PuzzleValidationError('"difficulty" must be an integer between 1 and 5', row);
  }
  if (!isNonEmptyString(row.title)) {
    throw new PuzzleValidationError('"title" must be a non-empty string', row);
  }
  if (!isPlainObject(row.content)) {
    throw new PuzzleValidationError('"content" must be an object', row);
  }
  if (!isPlainObject(row.solution)) {
    throw new PuzzleValidationError('"solution" must be an object', row);
  }
  if (row.explanation !== null && typeof row.explanation !== 'string') {
    throw new PuzzleValidationError('"explanation" must be a string or null', row);
  }
  if (typeof row.xp_reward !== 'number' || !Number.isInteger(row.xp_reward) || row.xp_reward <= 0) {
    throw new PuzzleValidationError('"xp_reward" must be a positive integer', row);
  }
  if (typeof row.is_active !== 'boolean') {
    throw new PuzzleValidationError('"is_active" must be a boolean', row);
  }
  if (!isNonEmptyString(row.created_at)) {
    throw new PuzzleValidationError('"created_at" must be a non-empty string', row);
  }
  if (!isNonEmptyString(row.updated_at)) {
    throw new PuzzleValidationError('"updated_at" must be a non-empty string', row);
  }

  return {
    id: row.id,
    puzzleType: row.puzzle_type,
    difficulty: row.difficulty,
    title: row.title,
    content: row.content,
    solution: row.solution,
    explanation: row.explanation,
    xpReward: row.xp_reward,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function validatePuzzleRows(rows: unknown): Puzzle[] {
  if (!Array.isArray(rows)) {
    throw new PuzzleValidationError('expected an array of puzzle rows', rows);
  }
  return rows.map(validatePuzzleRow);
}
