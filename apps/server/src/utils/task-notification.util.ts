export type TaskNotificationStatus = 'completed' | 'failed' | 'killed';

export type TaskNotification = {
  toolUseId: string | null;
  status: TaskNotificationStatus | null;
  title: string | null;
  body: string;
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TaskNotificationUtil {
  private static readonly blockPattern = /<task-notification>([\s\S]*?)<\/task-notification>/;
  private static readonly statusValues: readonly string[] = ['completed', 'failed', 'killed'];
  private static readonly agentSummaryPrefix = 'Agent ';
  private static readonly agentDescriptionPattern = /^Agent "([^"]*)"/;
  private static readonly titlePrefix = 'Result: ';
  private static readonly handbackPointerPrefix =
    "This agent's report was delivered to you as a message from";

  /** Reads a harness `<task-notification>` block. Returns null when there is none. */
  static parse(text: string): TaskNotification | null {
    const block = TaskNotificationUtil.blockPattern.exec(text)?.[1];
    if (block === undefined) return null;
    const summary = TaskNotificationUtil.readTag(block, 'summary') ?? '';
    const rawStatus = TaskNotificationUtil.readTag(block, 'status');
    const result = TaskNotificationUtil.readTag(block, 'result');
    return {
      toolUseId: TaskNotificationUtil.readTag(block, 'tool-use-id'),
      status:
        rawStatus !== null && TaskNotificationUtil.statusValues.includes(rawStatus)
          ? (rawStatus as TaskNotificationStatus)
          : null,
      title: TaskNotificationUtil.buildTitle(summary),
      body: result !== null && result !== '' ? result : summary,
    };
  }

  /** True when the body only points at a report that was already delivered as a message. */
  static isHandbackPointer(body: string): boolean {
    return body.startsWith(TaskNotificationUtil.handbackPointerPrefix);
  }

  private static buildTitle(summary: string): string | null {
    const description = TaskNotificationUtil.agentDescriptionPattern.exec(summary)?.[1];
    if (description !== undefined) return `${TaskNotificationUtil.titlePrefix}${description}`;
    return summary.startsWith(TaskNotificationUtil.agentSummaryPrefix) || summary === ''
      ? null
      : summary;
  }

  private static readTag(block: string, tag: string): string | null {
    const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(block);
    return match === null ? null : (match[1] ?? '').trim();
  }
}
