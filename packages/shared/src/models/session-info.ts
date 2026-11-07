import { z } from 'zod';

export const GitProviderSchema = z.enum(['github', 'gitlab']);

export type GitProvider = z.infer<typeof GitProviderSchema>;

export const SessionInfoSchema = z.object({
  model: z.string().nullable(),
  effort: z.string().nullable(),
  branch: z.string().nullable(),
  prProvider: GitProviderSchema.nullable(),
  prNumber: z.number().nullable(),
  prUrl: z.string().nullable(),
  contextUsed: z.number().nullable(),
  contextMax: z.number().nullable(),
  contextPercent: z.number().nullable(),
});

export type SessionInfo = z.infer<typeof SessionInfoSchema>;

export const EMPTY_SESSION_INFO: SessionInfo = {
  model: null,
  effort: null,
  branch: null,
  prProvider: null,
  prNumber: null,
  prUrl: null,
  contextUsed: null,
  contextMax: null,
  contextPercent: null,
};
