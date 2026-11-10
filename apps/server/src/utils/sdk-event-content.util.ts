import { INTERNAL_DETAIL_MAX } from '@/configs/limits.config.ts';
import { COMPACTED_OUTPUT_PREFIX, INTERNAL_EVENT_NAMES } from '@/configs/system-events.config.ts';
import { TextUtil } from '@/utils/text.util.ts';

export type CompactMetadata = {
  trigger: string;
  preTokens: number | undefined;
  postTokens: number | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SdkEventContentUtil {
  private static readonly ansiPattern = new RegExp(
    `${String.fromCharCode(27)}\\[[0-9;?]*[ -/]*[@-~]`,
    'g',
  );
  private static readonly textKeys = ['content', 'text', 'error', 'compact_error'] as const;
  private static readonly hiddenKeys: ReadonlySet<string> = new Set([
    'uuid',
    'session_id',
    'sessionId',
    'parentUuid',
    'logicalParentUuid',
  ]);
  private static readonly localCommandPattern =
    /^\s*<local-command-(stdout|stderr)>([\s\S]*?)(?:<\/local-command-\1>)?\s*$/;

  static eventName(message: Record<string, unknown>): string {
    const key = message.type === 'system' ? message.subtype : message.type;
    return typeof key === 'string' ? key : 'unknown';
  }

  static stripAnsi(text: string): string {
    return text.replace(SdkEventContentUtil.ansiPattern, '');
  }

  static isInternal(name: string, record: Record<string, unknown>): boolean {
    if (name === 'status') return record.compact_result !== 'failed';
    if (name === 'informational') return record.level === 'info';
    return INTERNAL_EVENT_NAMES.has(name);
  }

  static isError(name: string, message: Record<string, unknown>): boolean {
    return (
      name.toLowerCase().includes('error') ||
      message.is_error === true ||
      message.compact_result === 'failed'
    );
  }

  static cardContent(message: Record<string, unknown>): string {
    const text = SdkEventContentUtil.ownText(message);
    return TextUtil.truncate(text ?? SdkEventContentUtil.toJson(message, 2));
  }

  static detail(message: Record<string, unknown>): string {
    const text = SdkEventContentUtil.ownText(message) ?? SdkEventContentUtil.toJson(message);
    return text.length <= INTERNAL_DETAIL_MAX ? text : `${text.slice(0, INTERNAL_DETAIL_MAX)}…`;
  }

  static compactContent(metadata: CompactMetadata): string {
    const title = metadata.trigger === 'auto' ? 'Automatic compact' : 'Manual compact';
    if (metadata.preTokens === undefined) return title;
    const before = metadata.preTokens.toLocaleString('en-US');
    if (metadata.postTokens === undefined) return `${title}\nTokens before: ${before}`;
    return `${title}\nTokens: ${before} → ${metadata.postTokens.toLocaleString('en-US')}`;
  }

  static parseLocalCommandText(text: string): { body: string; isStderr: boolean } | null {
    const match = SdkEventContentUtil.localCommandPattern.exec(text);
    if (match === null) return null;
    return {
      body: SdkEventContentUtil.stripAnsi(match[2] ?? '').trim(),
      isStderr: match[1] === 'stderr',
    };
  }

  static isCompactedOutput(text: string): boolean {
    return text.trimStart().startsWith(COMPACTED_OUTPUT_PREFIX);
  }

  private static ownText(message: Record<string, unknown>): string | null {
    for (const key of SdkEventContentUtil.textKeys) {
      const value = message[key];
      if (typeof value === 'string' && value.trim() !== '') {
        return SdkEventContentUtil.stripAnsi(value);
      }
    }
    return null;
  }

  private static toJson(message: Record<string, unknown>, indent?: number): string {
    const visible = Object.fromEntries(
      Object.entries(message).filter(([key]) => !SdkEventContentUtil.hiddenKeys.has(key)),
    );
    return JSON.stringify(visible, null, indent) ?? '{}';
  }
}
