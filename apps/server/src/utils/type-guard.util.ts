// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TypeGuardUtil {
  static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
