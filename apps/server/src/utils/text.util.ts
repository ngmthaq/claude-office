import { TOOL_RESULT_MAX_CHARS } from '@/configs/limits.config.ts';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TextUtil {
  static cutStrings(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.length > TOOL_RESULT_MAX_CHARS
        ? `${value.slice(0, TOOL_RESULT_MAX_CHARS)}…`
        : value;
    }
    if (Array.isArray(value)) return value.map(TextUtil.cutStrings);
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, TextUtil.cutStrings(item)]),
      );
    }
    return value;
  }

  static truncate(text: string): string {
    if (text.length <= TOOL_RESULT_MAX_CHARS) return text;
    return `${text.slice(0, TOOL_RESULT_MAX_CHARS)}…(truncated)`;
  }

  static describeContent(content: unknown): string {
    if (typeof content === 'string') return content;
    if (!Array.isArray(content)) return '';
    const parts: string[] = [];
    for (const part of content as unknown[]) {
      if (typeof part !== 'object' || part === null || !('type' in part)) continue;
      if (part.type === 'text' && 'text' in part && typeof part.text === 'string') {
        parts.push(part.text);
      } else if (typeof part.type === 'string') {
        parts.push(`[${part.type}]`);
      }
    }
    return parts.join('\n');
  }
}
