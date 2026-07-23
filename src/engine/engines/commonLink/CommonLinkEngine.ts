/**
 * Reference implementation of `PuzzleEngine` — deliberately minimal.
 * Payload validation, answer normalization/checking, and explanation are
 * real; hint generation is an intentional placeholder (letter-reveal),
 * per T-010's "focus on architecture, not sophisticated gameplay logic."
 */
import { normalizeAnswerText } from '../../common/textNormalization';
import type { PuzzleEngine } from '../../interfaces/PuzzleEngine';
import type { AnswerCheckResult, Hint, ValidationResult } from '../../types';
import type { CommonLinkAnswer, CommonLinkContent, CommonLinkSolution } from './types';

const PUZZLE_TYPE = 'common-link';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const commonLinkEngine: PuzzleEngine<CommonLinkContent, CommonLinkSolution, CommonLinkAnswer> = {
  metadata: {
    puzzleType: PUZZLE_TYPE,
    displayName: 'Common Link',
    description: 'Find the single word or concept that connects a short list of items.',
  },

  validatePayload(content: unknown, solution: unknown): ValidationResult {
    const errors: string[] = [];

    if (!isPlainObject(content) || !Array.isArray(content.items)) {
      errors.push('"content.items" must be an array');
    } else if (content.items.length < 2) {
      errors.push('"content.items" must contain at least 2 items');
    } else if (!content.items.every(isNonEmptyString)) {
      errors.push('"content.items" must contain only non-empty strings');
    }

    if (!isPlainObject(solution) || !isNonEmptyString(solution.link)) {
      errors.push('"solution.link" must be a non-empty string');
    }

    return { valid: errors.length === 0, errors };
  },

  validateAnswer(answer: unknown): ValidationResult {
    if (!isNonEmptyString(answer)) {
      return { valid: false, errors: ['answer must be a non-empty string'] };
    }
    return { valid: true, errors: [] };
  },

  checkAnswer(
    _content: CommonLinkContent,
    solution: CommonLinkSolution,
    answer: CommonLinkAnswer,
  ): AnswerCheckResult<CommonLinkAnswer> {
    const normalizedAnswer = normalizeAnswerText(answer);
    const normalizedSolution = normalizeAnswerText(solution.link);
    return {
      isCorrect: normalizedAnswer === normalizedSolution,
      normalizedAnswer,
    };
  },

  generateExplanation(content: CommonLinkContent, solution: CommonLinkSolution): string {
    return `The common link is "${solution.link}". It connects: ${content.items.join(', ')}.`;
  },

  getHint(_content: CommonLinkContent, solution: CommonLinkSolution, hintLevel: number): Hint {
    if (!Number.isInteger(hintLevel) || hintLevel < 1) {
      throw new Error('hintLevel must be a positive integer');
    }

    const revealCount = Math.min(hintLevel, solution.link.length);
    return {
      level: hintLevel,
      text: `The answer starts with "${solution.link.slice(0, revealCount)}"`,
    };
  },
};
