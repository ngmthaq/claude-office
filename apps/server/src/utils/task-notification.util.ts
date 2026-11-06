export type TaskNotificationStatus = 'completed' | 'failed' | 'killed';

export type TaskNotification = {
  toolUseId: string | null;
  status: TaskNotificationStatus | null;
  title: string | null;
  body: string;
};

const BLOCK_PATTERN = /<task-notification>([\s\S]*?)<\/task-notification>/;
const STATUS_VALUES: readonly string[] = ['completed', 'failed', 'killed'];
const AGENT_SUMMARY_PREFIX = 'Agent ';
const AGENT_DESCRIPTION_PATTERN = /^Agent "([^"]*)"/;
const TITLE_PREFIX = 'Result: ';
const HANDBACK_POINTER_PREFIX = "This agent's report was delivered to you as a message from";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TaskNotificationUtil {
  /** Reads a harness `<task-notification>` block. Returns null when there is none. */
  static parse(text: string): TaskNotification | null {
    const block = BLOCK_PATTERN.exec(text)?.[1];
    if (block === undefined) return null;
    const summary = TaskNotificationUtil.readTag(block, 'summary') ?? '';
    const rawStatus = TaskNotificationUtil.readTag(block, 'status');
    const result = TaskNotificationUtil.readTag(block, 'result');
    return {
      toolUseId: TaskNotificationUtil.readTag(block, 'tool-use-id'),
      status:
        rawStatus !== null && STATUS_VALUES.includes(rawStatus)
          ? (rawStatus as TaskNotificationStatus)
          : null,
      title: TaskNotificationUtil.buildTitle(summary),
      body: result !== null && result !== '' ? result : summary,
    };
  }

  /** True when the body only points at a report that was already delivered as a message. */
  static isHandbackPointer(body: string): boolean {
    return body.startsWith(HANDBACK_POINTER_PREFIX);
  }

  private static buildTitle(summary: string): string | null {
    const description = AGENT_DESCRIPTION_PATTERN.exec(summary)?.[1];
    if (description !== undefined) return `${TITLE_PREFIX}${description}`;
    return summary.startsWith(AGENT_SUMMARY_PREFIX) || summary === '' ? null : summary;
  }

  private static readTag(block: string, tag: string): string | null {
    const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(block);
    return match === null ? null : (match[1] ?? '').trim();
  }
}
