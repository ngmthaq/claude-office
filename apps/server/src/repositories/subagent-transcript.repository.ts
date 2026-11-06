import { getSubagentMessages } from '@anthropic-ai/claude-agent-sdk';
import { TRANSCRIPT_READ_DELAY_MS, TRANSCRIPT_READ_RETRIES } from '@/configs/limits.config.ts';
import { AsyncUtil } from '@/utils/async.util.ts';

const FINAL_STOP_REASON = 'end_turn';

type TextBlock = { type: 'text'; text: string };

export class SubagentTranscriptRepository {
  /** Final answer text of a sub-agent, or null when the transcript has none yet. */
  async readFinalText(sessionId: string, agentId: string, dir: string): Promise<string | null> {
    for (let attempt = 0; attempt < TRANSCRIPT_READ_RETRIES; attempt++) {
      if (attempt > 0) await AsyncUtil.sleep(TRANSCRIPT_READ_DELAY_MS);
      const messages = await getSubagentMessages(sessionId, agentId, { dir });
      const text = selectFinalText(messages);
      if (text !== null) return text;
    }
    return null;
  }
}

function isTextBlock(block: unknown): block is TextBlock {
  return (
    typeof block === 'object' &&
    block !== null &&
    (block as { type?: unknown }).type === 'text' &&
    typeof (block as { text?: unknown }).text === 'string'
  );
}

function readAssistantText(message: unknown): string {
  if (typeof message !== 'object' || message === null) return '';
  const content = (message as { content?: unknown }).content;
  if (!Array.isArray(content)) return '';
  return content
    .filter(isTextBlock)
    .map((block) => block.text)
    .join('\n')
    .trim();
}

function readStopReason(message: unknown): unknown {
  if (typeof message !== 'object' || message === null) return undefined;
  return (message as { stop_reason?: unknown }).stop_reason;
}

function selectFinalText(
  messages: ReadonlyArray<{ type: string; message: unknown }>,
): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const entry = messages[i];
    if (entry?.type !== 'assistant') continue;
    if (readStopReason(entry.message) !== FINAL_STOP_REASON) continue;
    const text = readAssistantText(entry.message);
    if (text !== '') return text;
  }
  return null;
}
