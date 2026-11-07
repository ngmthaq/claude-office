export type ReportStatus = 'complete' | 'incomplete' | 'blocked' | 'done' | 'failed' | 'stopped';

type ReportStatusValue = 'complete' | 'incomplete' | 'blocked';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ReportStatusUtil {
  private static readonly statusPattern =
    /(?:[*_]*status[*_]*\s*:[*_\s]*|-\s*\[x\]\s*)(incomplete|complete|blocked)\b/i;

  static parse(report: string): ReportStatusValue | null {
    const match = ReportStatusUtil.statusPattern.exec(report);
    return match === null ? null : (match[1]?.toLowerCase() as ReportStatusValue);
  }
}
