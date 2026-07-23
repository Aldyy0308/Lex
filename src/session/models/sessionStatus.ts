/**
 * A session only ever completes by a correct answer in this pass — there's
 * no "give up"/"reveal answer" action yet (out of scope per T-011: no
 * gameplay screens exist to drive one). `submitAnswer` is the only
 * transition from `'in_progress'` to `'completed'`.
 */
export type PuzzleSessionStatus = 'in_progress' | 'completed';
