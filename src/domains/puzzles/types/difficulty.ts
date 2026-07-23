/**
 * `puzzles.difficulty` is a `smallint` constrained by the database to
 * `between 1 and 5` (`puzzles_difficulty_range`, see
 * docs/Architecture/database-schema.md). Mirrored here as a literal union so
 * the domain layer rejects the same range the database does, before a value
 * ever reaches a query.
 */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LEVELS: readonly Difficulty[] = [1, 2, 3, 4, 5];

export const DIFFICULTY_LABELS: Readonly<Record<Difficulty, string>> = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Expert',
};

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
}
