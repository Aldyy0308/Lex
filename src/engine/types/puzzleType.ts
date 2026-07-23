/**
 * The engine's own notion of a puzzle type identifier — a plain string, on
 * purpose. This is the type the registry keys on. It intentionally does not
 * import `src/domains/puzzles`' branded `PuzzleType` — the engine must never
 * depend on a domain (`docs/Architecture/project-structure.md`), and a
 * branded `string` is structurally a `string` anyway, so domain callers can
 * pass their `PuzzleType` values in here without any conversion.
 */
export type PuzzleTypeId = string;
