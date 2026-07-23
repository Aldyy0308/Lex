/** Only obtainable once a session has completed — see `getResult()`. */
export interface PuzzleSessionResult {
  puzzleId: string;
  puzzleType: string;
  isCorrect: boolean;
  normalizedAnswer: unknown;
  elapsedMs: number;
  explanation: string;
}
