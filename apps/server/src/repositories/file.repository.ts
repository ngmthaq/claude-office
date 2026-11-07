import { execFile } from 'node:child_process';
import { readdir, readFile, realpath, stat } from 'node:fs/promises';
import { join, posix, sep } from 'node:path';
import type { FileEntry } from '@claude-office/shared';
import { CODE_VIEWER_MAX_FILE_BYTES } from '@/configs/limits.config.ts';

export type FileListing = { files: FileEntry[]; truncated: boolean };

export type FileUnavailable = 'too_large' | 'binary' | 'not_found';

export type TextResult = { ok: true; text: string } | { ok: false; reason: FileUnavailable };

export class FileRepository {
  private static readonly binarySniffBytes = 8192;
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

  async listFiles(folder: string, options: { fresh?: boolean } = {}): Promise<FileListing> {
    const hit = this.cache.get(folder);
    if (!options.fresh && hit && Date.now() - hit.at < FileRepository.cacheTtlMs) {
      return hit.listing;
    }
    const paths = (await this.gitPaths(folder)) ?? (await this.walkPaths(folder));
    const listing = this.buildListing(paths);
    this.cache.set(folder, { at: Date.now(), listing });
    return listing;
  }

  static decode(data: Buffer): TextResult {
    if (data.length > CODE_VIEWER_MAX_FILE_BYTES) return { ok: false, reason: 'too_large' };
    if (data.subarray(0, FileRepository.binarySniffBytes).includes(0)) {
      return { ok: false, reason: 'binary' };
    }
    return { ok: true, text: data.toString('utf8') };
  }

  async readText(folder: string, rawPath: string): Promise<TextResult> {
    const path = this.normalize(rawPath);
    if (path === null) return { ok: false, reason: 'not_found' };
    try {
      const root = await realpath(folder);
      const real = await realpath(join(root, path));
      if (!real.startsWith(root.endsWith(sep) ? root : root + sep)) {
        return { ok: false, reason: 'not_found' };
      }
      const info = await stat(real);
      if (!info.isFile()) return { ok: false, reason: 'not_found' };
      if (info.size > CODE_VIEWER_MAX_FILE_BYTES) return { ok: false, reason: 'too_large' };
      return FileRepository.decode(await readFile(real));
    } catch {
      return { ok: false, reason: 'not_found' };
    }
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
