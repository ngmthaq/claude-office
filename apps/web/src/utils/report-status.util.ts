export type ReportStatus = 'complete' | 'incomplete' | 'blocked' | 'done' | 'failed' | 'stopped';

type ReportStatusValue = 'complete' | 'incomplete' | 'blocked';

const STATUS_PATTERN =
  /(?:[*_]*status[*_]*\s*:[*_\s]*|-\s*\[x\]\s*)(incomplete|complete|blocked)\b/i;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ReportStatusUtil {
  static parse(report: string): ReportStatusValue | null {
    const match = STATUS_PATTERN.exec(report);
    return match === null ? null : (match[1]?.toLowerCase() as ReportStatusValue);
  }
}
