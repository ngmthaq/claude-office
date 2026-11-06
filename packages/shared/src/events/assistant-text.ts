import { z } from 'zod';

export const AssistantTextEventSchema = z.object({
  type: z.literal('assistant_text'),
  roomId: z.string(),
  messageId: z.string(),
  delta: z.string(),
});

export type AssistantTextEvent = z.infer<typeof AssistantTextEventSchema>;
