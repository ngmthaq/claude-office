type EventContentFormat = 'json' | 'markdown' | 'text';

type EventContentView = { format: EventContentFormat; text: string };

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EventContentUtil {
  private static readonly markdownPatterns = [
    /^#{1,6}\s+\S/m,
    /^\s*(?:[-*+]|\d+\.)\s+\S/m,
    /^```/m,
    /^\|.+\|\s*$/m,
    /\*\*[^*\n]+\*\*/,
    /\[[^\]\n]+\]\([^)\s]+\)/,
  ];

  static detect(content: string): EventContentView {
    const json = EventContentUtil.parseJson(content);
    if (json !== null) return { format: 'json', text: json };
    const isMarkdown = EventContentUtil.markdownPatterns.some((pattern) => pattern.test(content));
    return { format: isMarkdown ? 'markdown' : 'text', text: content };
  }

  private static parseJson(content: string): string | null {
    const trimmed = content.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
    try {
      const value: unknown = JSON.parse(trimmed);
      if (typeof value !== 'object' || value === null) return null;
      return JSON.stringify(value, null, 2);
    } catch {
      return null;
    }
  }
}
