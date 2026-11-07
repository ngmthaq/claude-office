import { execFile } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { join, posix } from 'node:path';
import type { FileEntry } from '@claude-office/shared';

export type FileListing = { files: FileEntry[]; truncated: boolean };

export class FileRepository {
  private static readonly maxEntries = 5000;
  private static readonly cacheTtlMs = 30_000;
  private static readonly gitTimeoutMs = 3000;
  private static readonly gitMaxBuffer = 32 * 1024 * 1024;
  private static readonly walkMaxVisited = 20_000;
  private static readonly skippedDirs = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
  ]);

  private readonly cache = new Map<string, { at: number; listing: FileListing }>();

  async listFiles(folder: string): Promise<FileListing> {
    const hit = this.cache.get(folder);
    if (hit && Date.now() - hit.at < FileRepository.cacheTtlMs) return hit.listing;
    const paths = (await this.gitPaths(folder)) ?? (await this.walkPaths(folder));
    const listing = this.buildListing(paths);
    this.cache.set(folder, { at: Date.now(), listing });
    return listing;
  }

  private buildListing(paths: string[]): FileListing {
    const dirs = new Set<string>();
    const files = new Set<string>();
    for (const raw of paths) {
      const path = this.normalize(raw);
      if (path === null) continue;
      files.add(path);
      for (let dir = posix.dirname(path); dir !== '.'; dir = posix.dirname(dir)) {
        if (dirs.has(dir)) break;
        dirs.add(dir);
      }
    }
    const all: FileEntry[] = [
      ...[...dirs].map((path): FileEntry => ({ path, kind: 'dir' })),
      ...[...files].map((path): FileEntry => ({ path, kind: 'file' })),
    ].sort((a, b) => a.path.localeCompare(b.path));
    const truncated = all.length > FileRepository.maxEntries;
    return { files: truncated ? all.slice(0, FileRepository.maxEntries) : all, truncated };
  }

  private normalize(raw: string): string | null {
    const path = raw.replace(/\\/g, '/').replace(/^\.\//, '');
    if (path === '' || path.startsWith('/') || path.split('/').includes('..')) return null;
    return path;
  }

  private gitPaths(folder: string): Promise<string[] | null> {
    return new Promise((resolve) => {
      execFile(
        'git',
        ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        {
          cwd: folder,
          timeout: FileRepository.gitTimeoutMs,
          maxBuffer: FileRepository.gitMaxBuffer,
          encoding: 'utf8',
        },
        (error, stdout) => {
          if (error) {
            resolve(null);
            return;
          }
          resolve(stdout.split('\0').filter((path) => path !== ''));
        },
      );
    });
  }

  private async walkPaths(root: string): Promise<string[]> {
    const out: string[] = [];
    const queue: string[] = [''];
    let visited = 0;
    while (
      queue.length > 0 &&
      out.length < FileRepository.maxEntries &&
      visited < FileRepository.walkMaxVisited
    ) {
      const relative = queue.shift() ?? '';
      let items;
      try {
        items = await readdir(relative === '' ? root : join(root, relative), {
          withFileTypes: true,
        });
      } catch {
        continue;
      }
      for (const item of items) {
        visited += 1;
        if (item.isSymbolicLink()) continue;
        const path = relative === '' ? item.name : `${relative}/${item.name}`;
        if (item.isDirectory()) {
          if (FileRepository.skippedDirs.has(item.name)) continue;
          if (item.name.startsWith('.') && item.name !== '.claude') continue;
          queue.push(path);
        } else if (item.isFile()) {
          out.push(path);
        }
      }
    }
    return out;
  }
}
