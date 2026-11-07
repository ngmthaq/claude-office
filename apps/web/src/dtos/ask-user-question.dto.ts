import { z } from 'zod';

export const AskUserQuestionSchema = z.object({
  question: z.string(),
  header: z.string(),
  multiSelect: z.boolean().optional().default(false),
  options: z.array(
    z.object({
      label: z.string(),
      description: z.string().optional(),
      preview: z.string().optional(),
    }),
  ),
});

export type AskUserQuestion = z.infer<typeof AskUserQuestionSchema>;

export const AskUserQuestionInputSchema = z.object({
  questions: z.array(AskUserQuestionSchema).min(1),
});

export const AskUserQuestionSelectionSchema = z.object({
  selected: z.array(z.string()),
  otherOn: z.boolean(),
  otherText: z.string(),
});

export type AskUserQuestionSelection = z.infer<typeof AskUserQuestionSelectionSchema>;

export function parseAskUserQuestionInput(input: unknown): AskUserQuestion[] | null {
  const parsed = AskUserQuestionInputSchema.safeParse(input);
  return parsed.success ? parsed.data.questions : null;
}
