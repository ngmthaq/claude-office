import { getSubagentMessages } from '@anthropic-ai/claude-agent-sdk';
import { TRANSCRIPT_READ_DELAY_MS, TRANSCRIPT_READ_RETRIES } from '@/configs/limits.config.ts';
import { AsyncUtil } from '@/utils/async.util.ts';

type TextBlock = { type: 'text'; text: string };

export class SubagentTranscriptRepository {
  private static readonly finalStopReason = 'end_turn';

  /** Final answer text of a sub-agent, or null when the transcript has none yet. */
  async readFinalText(sessionId: string, agentId: string, dir: string): Promise<string | null> {
    for (let attempt = 0; attempt < TRANSCRIPT_READ_RETRIES; attempt++) {
      if (attempt > 0) await AsyncUtil.sleep(TRANSCRIPT_READ_DELAY_MS);
      const messages = await getSubagentMessages(sessionId, agentId, { dir });
      const text = SubagentTranscriptRepository.selectFinalText(messages);
      if (text !== null) return text;
    }
    return null;
  }

  private static isTextBlock(block: unknown): block is TextBlock {
    return (
      typeof block === 'object' &&
      block !== null &&
      (block as { type?: unknown }).type === 'text' &&
      typeof (block as { text?: unknown }).text === 'string'
    );
  }

  private static readAssistantText(message: unknown): string {
    if (typeof message !== 'object' || message === null) return '';
    const content = (message as { content?: unknown }).content;
    if (!Array.isArray(content)) return '';
    return content
      .filter(SubagentTranscriptRepository.isTextBlock)
      .map((block) => block.text)
      .join('\n')
      .trim();
  }

  private static readStopReason(message: unknown): unknown {
    if (typeof message !== 'object' || message === null) return undefined;
    return (message as { stop_reason?: unknown }).stop_reason;
  }

  private static selectFinalText(
    messages: ReadonlyArray<{ type: string; message: unknown }>,
  ): string | null {
    for (let i = messages.length - 1; i >= 0; i--) {
      const entry = messages[i];
      if (entry?.type !== 'assistant') continue;
      const stopReason = SubagentTranscriptRepository.readStopReason(entry.message);
      if (stopReason !== SubagentTranscriptRepository.finalStopReason) continue;
      const text = SubagentTranscriptRepository.readAssistantText(entry.message);
      if (text !== '') return text;
    }
    return null;
  }
}
