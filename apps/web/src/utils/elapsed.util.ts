// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ElapsedUtil {
  private static readonly secondMs = 1000;
  private static readonly unitSize = 60;

  static short(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / ElapsedUtil.secondMs));
    const totalMinutes = Math.floor(totalSeconds / ElapsedUtil.unitSize);
    const seconds = totalSeconds % ElapsedUtil.unitSize;
    if (totalMinutes === 0) return `${seconds}s`;
    const hours = Math.floor(totalMinutes / ElapsedUtil.unitSize);
    const minutes = totalMinutes % ElapsedUtil.unitSize;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
  }
}
