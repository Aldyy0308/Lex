/**
 * Supabase-backed `PuzzleRepository`. The only file in this domain allowed
 * to import `src/services/supabase`, per the boundary rule in
 * `src/domains/README.md`. Every row is passed through
 * `validatePuzzleRow`/`validatePuzzleRows` before it reaches the caller —
 * this repository never returns unvalidated Supabase data.
 */
import { supabase } from '../../../services/supabase';
import type { Puzzle } from '../models/Puzzle';
import type { PuzzleType } from '../types/puzzleType';
import { validatePuzzleRow, validatePuzzleRows } from '../validation/puzzleValidation';
import type { PuzzleRepository } from './puzzleRepository';

const PUZZLES_TABLE = 'puzzles';

export const supabasePuzzleRepository: PuzzleRepository = {
  async getPuzzleById(id: string): Promise<Puzzle | null> {
    const { data, error } = await supabase.from(PUZZLES_TABLE).select('*').eq('id', id).maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      return null;
    }

    return validatePuzzleRow(data);
  },

  async getActivePuzzles(): Promise<Puzzle[]> {
    const { data, error } = await supabase.from(PUZZLES_TABLE).select('*').eq('is_active', true);

    if (error) {
      throw new Error(error.message);
    }

    return validatePuzzleRows(data ?? []);
  },

  async getPuzzlesByType(puzzleType: PuzzleType): Promise<Puzzle[]> {
    const { data, error } = await supabase.from(PUZZLES_TABLE).select('*').eq('puzzle_type', puzzleType);

    if (error) {
      throw new Error(error.message);
    }

    return validatePuzzleRows(data ?? []);
  },
};
