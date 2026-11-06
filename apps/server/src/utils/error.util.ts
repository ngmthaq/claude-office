// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorUtil {
  static errorName(error: unknown): string {
    return error instanceof Error ? error.name : 'unknown';
  }
}
