/**
 * Public surface of the Puzzle Engine, and the one "bootstrap import" that
 * knows the full list of puzzle types (`docs/Architecture/
 * project-structure.md`'s registry pattern) — registering a new puzzle type
 * means adding one line here, never touching the registry, interface, or
 * any other engine.
 */
import { commonLinkEngine } from './engines/commonLink';
import { puzzleEngineRegistry } from './registry/PuzzleEngineRegistry';

puzzleEngineRegistry.register(commonLinkEngine);

export type { PuzzleEngine } from './interfaces/PuzzleEngine';
export { DuplicateEngineRegistrationError, PuzzleEngineRegistry, puzzleEngineRegistry } from './registry/PuzzleEngineRegistry';
export type { AnswerCheckResult, Hint, PuzzleEngineMetadata, PuzzleTypeId, ValidationResult } from './types';
export { isRegisteredPuzzleType } from './validation/validatePuzzleType';
export { commonLinkEngine } from './engines/commonLink';
export type { CommonLinkAnswer, CommonLinkContent, CommonLinkSolution } from './engines/commonLink';
