import type { Puzzle } from '../models/Puzzle';
import type { PuzzleType } from '../types/puzzleType';

/**
 * The Puzzle domain's boundary to persistence. Callers depend on this
 * interface, not on `SupabasePuzzleRepository` directly, so the backend
 * could be swapped without touching anything above this layer (the same
 * repository pattern `src/services/README.md` describes).
 */
export interface PuzzleRepository {
  getPuzzleById(id: string): Promise<Puzzle | null>;
  getActivePuzzles(): Promise<Puzzle[]>;
  getPuzzlesByType(puzzleType: PuzzleType): Promise<Puzzle[]>;
}
