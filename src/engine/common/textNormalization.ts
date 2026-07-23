/**
 * Shared logic reusable across multiple puzzle engines — as opposed to
 * `engines/`, which holds logic unique to one puzzle type. Named `common/`
 * before `CommonLinkEngine` existed; the overlap in name is coincidental,
 * not a hierarchy (`common/` is not "common to Common Link").
 */

/** Case/whitespace-insensitive normalization for free-text answer comparison. */
export function normalizeAnswerText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
