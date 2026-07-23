export interface AnswerCheckResult<TAnswer = unknown> {
  isCorrect: boolean;
  normalizedAnswer: TAnswer;
}
