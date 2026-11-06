import type { z } from 'zod';

export type ParseFailure = {
  success: false;
  /** The message `type` field when it is a string, for logging. Never the payload. */
  eventType: string | undefined;
  /** Zod issue paths only, e.g. `time` or `(root)`. */
  issuePaths: string[];
};

export type ParseResult<T> = { success: true; data: T } | ParseFailure;

export function parseWith<T>(schema: z.ZodType<T>, raw: unknown): ParseResult<T> {
  const value = typeof raw === 'string' ? safeJsonParse(raw) : raw;
  const result = schema.safeParse(value);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    eventType: readEventType(value),
    issuePaths: result.error.issues.map((issue) => issue.path.join('.') || '(root)'),
  };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function readEventType(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || !('type' in value)) return undefined;
  return typeof value.type === 'string' ? value.type : undefined;
}
