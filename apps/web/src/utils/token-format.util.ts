// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TokenFormatUtil {
  private static readonly thousand = 1000;
  private static readonly million = 1_000_000;

  static short(value: number): string {
    if (value >= TokenFormatUtil.million) {
      return `${TokenFormatUtil.trim(value / TokenFormatUtil.million)}M`;
    }
    if (value >= TokenFormatUtil.thousand) {
      return `${TokenFormatUtil.trim(value / TokenFormatUtil.thousand)}k`;
    }
    return String(Math.round(value));
  }

  private static trim(value: number): string {
    return String(Math.round(value * 10) / 10);
  }
}
