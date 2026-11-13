type PeerEnvelope = { from: string; body: string; isHandback: boolean };

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PeerMessageUtil {
  private static readonly envelopePattern =
    /<agent-message from="([^"]*)">([\s\S]*?)<\/agent-message>/;
  private static readonly handbackMarker = '[Subagent hand-back]';
  private static readonly reportStartMarker = 'The report follows:';
  private static readonly harnessLinePrefix = '[harness:';
  private static readonly reportIndent = '  ';

  /** Reads the harness text envelope of a peer message. Returns null when there is none. */
  static parsePeerEnvelope(text: string): PeerEnvelope | null {
    const match = PeerMessageUtil.envelopePattern.exec(text);
    if (match === null) return null;
    const from = match[1] ?? '';
    let inner = match[2] ?? '';
    const isHandback = inner.trimStart().startsWith(PeerMessageUtil.handbackMarker);
    if (isHandback) {
      const markerAt = inner.indexOf(PeerMessageUtil.reportStartMarker);
      if (markerAt !== -1) inner = inner.slice(markerAt + PeerMessageUtil.reportStartMarker.length);
    }
    const body = inner
      .split('\n')
      .filter((line) => !line.trimStart().startsWith(PeerMessageUtil.harnessLinePrefix))
      .map((line) =>
        line.startsWith(PeerMessageUtil.reportIndent)
          ? line.slice(PeerMessageUtil.reportIndent.length)
          : line,
      )
      .join('\n')
      .trim();
    return { from, body, isHandback };
  }
}
