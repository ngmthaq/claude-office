import { z } from 'zod';
import { AskUserQuestionSelectionSchema } from '@/dtos/ask-user-question.dto';

export const QuestionProgressSchema = z.object({
  selections: z.array(AskUserQuestionSelectionSchema),
  step: z.number().int().nonnegative(),
  maxVisited: z.number().int().nonnegative(),
});

export type QuestionProgress = z.infer<typeof QuestionProgressSchema>;

export const EMPTY_QUESTION_PROGRESS: QuestionProgress = { selections: [], step: 0, maxVisited: 0 };
