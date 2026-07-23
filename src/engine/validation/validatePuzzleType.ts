import { puzzleEngineRegistry, PuzzleEngineRegistry } from '../registry/PuzzleEngineRegistry';
import type { PuzzleTypeId } from '../types';

/**
 * Whether `value` is both a string and an actually-registered puzzle type.
 * This is the replacement for the old "is this a non-empty string" check in
 * `domains/puzzles` — a puzzle type is only valid if some engine claims it.
 *
 * `registry` defaults to the shared singleton but can be overridden with an
 * isolated `PuzzleEngineRegistry` instance in tests, so verifying "unknown
 * type rejected" doesn't depend on which engines happen to be registered
 * app-wide.
 */
export function isRegisteredPuzzleType(
  value: unknown,
  registry: PuzzleEngineRegistry = puzzleEngineRegistry,
): value is PuzzleTypeId {
  return typeof value === 'string' && value.trim().length > 0 && registry.isRegistered(value);
}
