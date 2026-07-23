export type { PuzzleRepository } from './api/puzzleRepository';
export { resolveEngineForPuzzle } from './api/puzzleEngineResolver';
export { supabasePuzzleRepository } from './api/supabasePuzzleRepository';
export type { Puzzle } from './models/Puzzle';
export { DIFFICULTY_LABELS, DIFFICULTY_LEVELS, isDifficulty } from './types/difficulty';
export type { Difficulty } from './types/difficulty';
export { isPuzzleType, toPuzzleType } from './types/puzzleType';
export type { PuzzleType } from './types/puzzleType';
export { PuzzleValidationError, validatePuzzleRow, validatePuzzleRows } from './validation/puzzleValidation';
