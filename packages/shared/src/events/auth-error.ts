import { z } from 'zod';

export const AuthErrorEventSchema = z.object({
  type: z.literal('auth_error'),
  roomId: z.string(),
  message: z.string(),
});

export type AuthErrorEvent = z.infer<typeof AuthErrorEventSchema>;
