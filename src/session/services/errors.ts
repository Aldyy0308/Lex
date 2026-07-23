export class PuzzleNotFoundError extends Error {
  constructor(puzzleId: string) {
    super(`No puzzle found with id "${puzzleId}"`);
    this.name = 'PuzzleNotFoundError';
  }
}

/** Thrown when a puzzle row's `content`/`solution` don't match what its own engine expects — see `PuzzleEngine.validatePayload`. */
export class InvalidPuzzlePayloadError extends Error {
  constructor(puzzleId: string, errors: string[]) {
    super(`Puzzle "${puzzleId}" failed engine payload validation: ${errors.join('; ')}`);
    this.name = 'InvalidPuzzlePayloadError';
  }
}
