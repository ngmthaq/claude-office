import { createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { HOME_DIR } from '@/configs/app.config.ts';
import type { CompactMetadata } from '@/utils/sdk-event-content.util.ts';

export type TranscriptSystemRow = {
  index: number;
  uuid: string;
  subtype: string;
  content: string | null;
  level: string | null;
  compactMetadata: CompactMetadata | null;
  commandName: string | null;
  record: Record<string, unknown>;
};

export type TranscriptSystemRows = {
  rows: TranscriptSystemRow[];
  messageOrder: Map<string, number>;
};

export class TranscriptSystemRowsRepository {
  private static readonly uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  private static readonly projectsDir = join(HOME_DIR, '.claude', 'projects');

  async read(sessionId: string): Promise<TranscriptSystemRows | null> {
    if (!TranscriptSystemRowsRepository.uuidPattern.test(sessionId)) return null;
    try {
      const path = await this.findFile(sessionId);
      if (path === null) return null;
      return await this.scan(path);
    } catch {
      return null;
    }
  }

  private async findFile(sessionId: string): Promise<string | null> {
    const folders = await readdir(TranscriptSystemRowsRepository.projectsDir, {
      withFileTypes: true,
    });
    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      const dir = join(TranscriptSystemRowsRepository.projectsDir, folder.name);
      const names = await readdir(dir);
      if (names.includes(`${sessionId}.jsonl`)) return join(dir, `${sessionId}.jsonl`);
    }
    return null;
  }

  private async scan(path: string): Promise<TranscriptSystemRows> {
    const rows: TranscriptSystemRow[] = [];
    const messageOrder = new Map<string, number>();
    const lines = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
    let index = 0;
    for await (const line of lines) {
      index += 1;
      const record = this.parse(line);
      if (record === null || record.isSidechain === true) continue;
      const uuid = record.uuid;
      if (typeof uuid !== 'string') continue;
      if (record.type === 'user' || record.type === 'assistant') {
        messageOrder.set(uuid, index);
      } else if (record.type === 'system' && typeof record.subtype === 'string') {
        rows.push(this.toRow(index, uuid, record.subtype, record));
      }
    }
    return { rows, messageOrder };
  }

  private parse(line: string): Record<string, unknown> | null {
    try {
      const value: unknown = JSON.parse(line);
      return typeof value === 'object' && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }

  private toRow(
    index: number,
    uuid: string,
    subtype: string,
    record: Record<string, unknown>,
  ): TranscriptSystemRow {
    return {
      index,
      uuid,
      subtype,
      content: typeof record.content === 'string' ? record.content : null,
      level: typeof record.level === 'string' ? record.level : null,
      compactMetadata: this.compactMetadata(record.compactMetadata),
      commandName: this.commandName(record.commandRun),
      record,
    };
  }

  private compactMetadata(value: unknown): CompactMetadata | null {
    if (typeof value !== 'object' || value === null) return null;
    const meta = value as Record<string, unknown>;
    return {
      trigger: typeof meta.trigger === 'string' ? meta.trigger : 'manual',
      preTokens: typeof meta.preTokens === 'number' ? meta.preTokens : undefined,
      postTokens: typeof meta.postTokens === 'number' ? meta.postTokens : undefined,
    };
  }

  private commandName(value: unknown): string | null {
    if (typeof value !== 'object' || value === null || !('command' in value)) return null;
    return typeof value.command === 'string' ? value.command : null;
  }
}
