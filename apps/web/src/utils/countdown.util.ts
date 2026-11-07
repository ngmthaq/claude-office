// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CountdownUtil {
  private static readonly minuteMs = 60_000;
  private static readonly minutesPerHour = 60;

  static short(msLeft: number): string {
    if (msLeft <= 0) return 'reset';
    if (msLeft < CountdownUtil.minuteMs) return '<1m';
    const totalMinutes = Math.floor(msLeft / CountdownUtil.minuteMs);
    const hours = Math.floor(totalMinutes / CountdownUtil.minutesPerHour);
    const minutes = totalMinutes % CountdownUtil.minutesPerHour;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
