import type { PuzzleEngine } from '../interfaces/PuzzleEngine';
import type { PuzzleTypeId } from '../types';

export class DuplicateEngineRegistrationError extends Error {
  constructor(puzzleType: PuzzleTypeId) {
    super(`A puzzle engine is already registered for puzzle type "${puzzleType}"`);
    this.name = 'DuplicateEngineRegistrationError';
  }
}

/**
 * The single source of truth for which puzzle types are supported at
 * runtime, per `docs/Architecture/database-schema.md`'s decision to make
 * `puzzles.puzzle_type` a `text` column instead of an enum specifically so
 * this registry — not the database, not a domain — owns that answer.
 *
 * Exported as both a class (for isolated tests, e.g. duplicate-registration
 * checks that shouldn't pollute the app-wide registry) and a singleton
 * instance (`puzzleEngineRegistry`) that the rest of the app shares, the
 * same pattern `services/supabase/client.ts` uses for its client.
 */
export class PuzzleEngineRegistry {
  private readonly engines = new Map<PuzzleTypeId, PuzzleEngine<any, any, any>>();

  register(engine: PuzzleEngine<any, any, any>): void {
    const { puzzleType } = engine.metadata;
    if (this.engines.has(puzzleType)) {
      throw new DuplicateEngineRegistrationError(puzzleType);
    }
    this.engines.set(puzzleType, engine);
  }

  getEngine(puzzleType: PuzzleTypeId): PuzzleEngine<any, any, any> | undefined {
    return this.engines.get(puzzleType);
  }

  isRegistered(puzzleType: PuzzleTypeId): boolean {
    return this.engines.has(puzzleType);
  }

  getRegisteredTypes(): PuzzleTypeId[] {
    return Array.from(this.engines.keys());
  }
}

export const puzzleEngineRegistry = new PuzzleEngineRegistry();
