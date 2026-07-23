import type { Difficulty } from '../types/difficulty';
import type { PuzzleType } from '../types/puzzleType';

/**
 * `content`/`solution` stay `Record<string, unknown>` at this layer — each
 * puzzle type plugin (`src/puzzles/*`) owns its own content shape, and the
 * Puzzle domain has no business narrowing that further (see
 * `docs/Architecture/database-schema.md` on `puzzles.content`/`solution`
 * being jsonb on purpose).
 */
export interface Puzzle {
  id: string;
  puzzleType: PuzzleType;
  difficulty: Difficulty;
  title: string;
  content: Record<string, unknown>;
  solution: Record<string, unknown>;
  explanation: string | null;
  xpReward: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
