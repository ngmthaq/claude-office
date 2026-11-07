import { open, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { SlashCommandEntry } from '@claude-office/shared';
import { HOME_DIR } from '@/configs/app.config.ts';

type Frontmatter = Record<string, string>;

export class CommandRepository {
  private static readonly readLimitBytes = 4096;
  private static readonly maxDepth = 5;
  private static readonly maxFilesPerRoot = 500;

  async scanDiskCommands(folder: string): Promise<SlashCommandEntry[]> {
    const roots = [join(folder, '.claude'), join(HOME_DIR, '.claude')];
    const found: SlashCommandEntry[] = [];
    for (const root of roots) {
      found.push(...(await this.scanCommands(join(root, 'commands'))));
      found.push(...(await this.scanSkills(join(root, 'skills'))));
    }
    const seen = new Set<string>();
    const unique = found.filter((entry) => {
      if (seen.has(entry.name)) return false;
      seen.add(entry.name);
      return true;
    });
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }

  private async scanCommands(dir: string): Promise<SlashCommandEntry[]> {
    const files: string[] = [];
    await this.collectMarkdown(dir, [], files);
    const entries: SlashCommandEntry[] = [];
    for (const relative of files) {
      const meta = await this.readFrontmatter(join(dir, relative));
      const parts = relative.split('/');
      const last = (parts.pop() ?? '').replace(/\.md$/, '');
      if (last === '') continue;
      entries.push(this.toEntry([...parts, last].join(':'), meta));
    }
    return entries;
  }

  private async scanSkills(dir: string): Promise<SlashCommandEntry[]> {
    const folders = await this.safeReaddir(dir);
    const entries: SlashCommandEntry[] = [];
    for (const item of folders) {
      if (!item.isDirectory() && !item.isSymbolicLink()) continue;
      const meta = await this.readFrontmatter(join(dir, item.name, 'SKILL.md'));
      if (!meta) continue;
      entries.push(this.toEntry(meta.name || item.name, meta));
    }
    return entries;
  }

  private async collectMarkdown(base: string, segments: string[], out: string[]): Promise<void> {
    if (
      segments.length > CommandRepository.maxDepth ||
      out.length >= CommandRepository.maxFilesPerRoot
    )
      return;
    const items = await this.safeReaddir(join(base, ...segments));
    for (const item of items) {
      if (item.isSymbolicLink()) continue;
      if (item.isDirectory()) {
        await this.collectMarkdown(base, [...segments, item.name], out);
      } else if (item.isFile() && item.name.endsWith('.md')) {
        out.push([...segments, item.name].join('/'));
      }
    }
  }

  private toEntry(name: string, meta: Frontmatter | null): SlashCommandEntry {
    return {
      name,
      description: meta?.description ?? '',
      argumentHint: meta?.['argument-hint'] ?? '',
    };
  }

  private async safeReaddir(dir: string) {
    try {
      return await readdir(dir, { withFileTypes: true });
    } catch {
      return [];
    }
  }

  private async readFrontmatter(path: string): Promise<Frontmatter | null> {
    const head = await this.readHead(path);
    if (head === null) return null;
    const lines = head.replace(/\r\n/g, '\n').split('\n');
    if (lines[0]?.trim() !== '---') return {};
    const meta: Frontmatter = {};
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i] ?? '';
      if (line.trim() === '---') break;
      const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
      if (!match) continue;
      const key = match[1] ?? '';
      let value = (match[2] ?? '').trim();
      if (/^[>|][+-]?$/.test(value)) {
        const block: string[] = [];
        while (/^\s+\S/.test(lines[i + 1] ?? '')) {
          i += 1;
          block.push((lines[i] ?? '').trim());
        }
        value = block.join(' ');
      }
      meta[key] = this.stripQuotes(value);
    }
    return meta;
  }

  private async readHead(path: string): Promise<string | null> {
    let handle;
    try {
      handle = await open(path, 'r');
      const buffer = Buffer.alloc(CommandRepository.readLimitBytes);
      const { bytesRead } = await handle.read(buffer, 0, CommandRepository.readLimitBytes, 0);
      return buffer.subarray(0, bytesRead).toString('utf8');
    } catch {
      return null;
    } finally {
      await handle?.close();
    }
  }

  private stripQuotes(value: string): string {
    if (value.length >= 2 && /^(['"]).*\1$/.test(value)) return value.slice(1, -1);
    return value;
  }
}
