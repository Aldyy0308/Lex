import type { PuzzleSessionStatus } from './sessionStatus';

/**
 * A plain-data view of a session at a point in time — timestamps as ISO
 * strings, no methods. Exists so a future consumer (e.g. a React hook) can
 * expose session state without holding a reference to the session object
 * itself; nothing here is UI-specific.
 */
export interface PuzzleSessionSnapshot {
  puzzleId: string;
  puzzleType: string;
  status: PuzzleSessionStatus;
  startedAt: string;
  completedAt: string | null;
  elapsedMs: number;
}
