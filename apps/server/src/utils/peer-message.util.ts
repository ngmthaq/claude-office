export type PeerEnvelope = { from: string; body: string; isHandback: boolean };

const ENVELOPE_PATTERN = /<agent-message from="([^"]*)">([\s\S]*?)<\/agent-message>/;
const HANDBACK_MARKER = '[Subagent hand-back]';
const REPORT_START_MARKER = 'The report follows:';
const HARNESS_LINE_PREFIX = '[harness:';
const REPORT_INDENT = '  ';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PeerMessageUtil {
  /** Reads the harness text envelope of a peer message. Returns null when there is none. */
  static parsePeerEnvelope(text: string): PeerEnvelope | null {
    const match = ENVELOPE_PATTERN.exec(text);
    if (match === null) return null;
    const from = match[1] ?? '';
    let inner = match[2] ?? '';
    const isHandback = inner.trimStart().startsWith(HANDBACK_MARKER);
    if (isHandback) {
      const markerAt = inner.indexOf(REPORT_START_MARKER);
      if (markerAt !== -1) inner = inner.slice(markerAt + REPORT_START_MARKER.length);
    }
    const body = inner
      .split('\n')
      .filter((line) => !line.trimStart().startsWith(HARNESS_LINE_PREFIX))
      .map((line) => (line.startsWith(REPORT_INDENT) ? line.slice(REPORT_INDENT.length) : line))
      .join('\n')
      .trim();
    return { from, body, isHandback };
  }
}
