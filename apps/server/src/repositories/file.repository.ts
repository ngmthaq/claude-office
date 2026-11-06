import { execFile } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { join, posix } from 'node:path';
import type { FileEntry } from '@claude-office/shared';

export type FileListing = { files: FileEntry[]; truncated: boolean };

const MAX_ENTRIES = 5000;
const CACHE_TTL_MS = 30_000;
const GIT_TIMEOUT_MS = 3000;
const GIT_MAX_BUFFER = 32 * 1024 * 1024;
const WALK_MAX_VISITED = 20_000;
const SKIPPED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);

export class FileRepository {
  private readonly cache = new Map<string, { at: number; listing: FileListing }>();

  async listFiles(folder: string): Promise<FileListing> {
    const hit = this.cache.get(folder);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.listing;
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
    const truncated = all.length > MAX_ENTRIES;
    return { files: truncated ? all.slice(0, MAX_ENTRIES) : all, truncated };
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
        { cwd: folder, timeout: GIT_TIMEOUT_MS, maxBuffer: GIT_MAX_BUFFER, encoding: 'utf8' },
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
    while (queue.length > 0 && out.length < MAX_ENTRIES && visited < WALK_MAX_VISITED) {
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
          if (SKIPPED_DIRS.has(item.name)) continue;
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
