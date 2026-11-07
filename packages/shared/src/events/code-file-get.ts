import { z } from 'zod';

export const CodeFileGetEventSchema = z.object({
  type: z.literal('code_file_get'),
  roomId: z.string(),
  path: z.string(),
});

export type CodeFileGetEvent = z.infer<typeof CodeFileGetEventSchema>;
