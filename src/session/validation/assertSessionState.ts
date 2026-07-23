/**
 * Guards the session's own state machine (in_progress → completed) — not to
 * be confused with the engine's `validatePayload`/`validateAnswer`, which
 * validate puzzle-type-specific *data* shapes. This is generic across every
 * puzzle type and never delegates to an engine.
 */
import type { PuzzleSessionStatus } from '../models';

export class InvalidSessionStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSessionStateError';
  }
}

export function assertInProgress(status: PuzzleSessionStatus): void {
  if (status !== 'in_progress') {
    throw new InvalidSessionStateError(`Session is "${status}"; this action requires "in_progress"`);
  }
}

export function assertCompleted(status: PuzzleSessionStatus): void {
  if (status !== 'completed') {
    throw new InvalidSessionStateError(`Session is "${status}"; this action requires "completed"`);
  }
}
