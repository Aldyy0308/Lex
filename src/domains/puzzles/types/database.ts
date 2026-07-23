/**
 * The raw shape of a `public.puzzles` row, as Supabase returns it
 * (snake_case, JSON-safe). See
 * `supabase/migrations/20260722103200_create_puzzles.sql` for the source of
 * truth. Nothing outside `validation/` and `api/` should import this —
 * everything else consumes the mapped `Puzzle` domain model instead.
 */
export interface PuzzleRow {
  id: string;
  puzzle_type: string;
  difficulty: number;
  title: string;
  content: unknown;
  solution: unknown;
  explanation: string | null;
  xp_reward: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
