import { z } from 'zod';

export const ConnectionStatusSchema = z.enum(['connecting', 'connected', 'disconnected']);

export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;
