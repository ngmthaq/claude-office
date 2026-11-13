import { execFile } from 'node:child_process';
import type { GitFileStatus, GitProvider } from '@claude-office/shared';
import { z } from 'zod';
import {
  GH_TIMEOUT_MS,
  GIT_HOST_PROVIDERS,
  GIT_TIMEOUT_MS,
  GLAB_TIMEOUT_MS,
} from '@/configs/git.config.ts';
import { CODE_VIEWER_MAX_FILE_BYTES } from '@/configs/limits.config.ts';

type PrInfo = { number: number; url: string };

export type GitStatusEntry = { path: string; status: GitFileStatus; oldPath?: string };

type HeadContent = { ok: true; data: Buffer } | { ok: false; reason: 'missing' | 'too_large' };

type PrCommand = {
  command: string;
  args: string[];
  timeout: number;
  parse: (json: unknown) => PrInfo | null;
};

export class GitRepository {
  private static readonly maxBuffer = 1024 * 1024;
  private static readonly statusMaxBuffer = 32 * 1024 * 1024;
  private static readonly detachedLabel = 'detached';
  private static readonly urlPrefix = 'https://';
  private static readonly scpPattern = /^[^@/\s]+@([^:/\s]+):/;

  private static readonly prCommands: Record<GitProvider, PrCommand> = {
    github: {
      command: 'gh',
      args: ['pr', 'view', '--json', 'number,url'],
      timeout: GH_TIMEOUT_MS,
      parse: (json) => {
        const parsed = z.object({ number: z.number(), url: z.string() }).safeParse(json);
        return parsed.success ? parsed.data : null;
      },
    },
    gitlab: {
      command: 'glab',
      args: ['mr', 'view', '--output', 'json'],
      timeout: GLAB_TIMEOUT_MS,
      parse: (json) => {
        const parsed = z.object({ iid: z.number(), web_url: z.string() }).safeParse(json);
        return parsed.success ? { number: parsed.data.iid, url: parsed.data.web_url } : null;
      },
    },
  };

  static hostOf(remoteUrl: string): string | null {
    const url = remoteUrl.trim();
    const scp = GitRepository.scpPattern.exec(url);
    if (scp?.[1]) return scp[1].toLowerCase();
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return hostname === '' ? null : hostname;
    } catch {
      return null;
    }
  }

  static providerOf(remoteUrl: string): GitProvider | null {
    const host = GitRepository.hostOf(remoteUrl);
    if (host === null) return null;
    return GIT_HOST_PROVIDERS.find((row) => host.includes(row.hostPart))?.provider ?? null;
  }

  static parsePr(provider: GitProvider, output: string): PrInfo | null {
    try {
      const pr = GitRepository.prCommands[provider].parse(JSON.parse(output));
      if (pr === null || !pr.url.startsWith(GitRepository.urlPrefix)) return null;
      return pr;
    } catch {
      return null;
    }
  }

  async currentBranch(folder: string): Promise<string | null> {
    const output = await this.run('git', ['branch', '--show-current'], folder, GIT_TIMEOUT_MS);
    if (output === null) return null;
    const branch = output.trim();
    return branch === '' ? GitRepository.detachedLabel : branch;
  }

  async remoteProvider(folder: string): Promise<GitProvider | null> {
    const output = await this.run('git', ['remote', 'get-url', 'origin'], folder, GIT_TIMEOUT_MS);
    return output === null ? null : GitRepository.providerOf(output);
  }

  async findPr(folder: string, provider: GitProvider): Promise<PrInfo | null> {
    const { command, args, timeout } = GitRepository.prCommands[provider];
    const output = await this.run(command, args, folder, timeout);
    return output === null ? null : GitRepository.parsePr(provider, output);
  }

  async statusEntries(folder: string): Promise<GitStatusEntry[] | null> {
    const prefixOutput = await this.run(
      'git',
      ['rev-parse', '--show-prefix'],
      folder,
      GIT_TIMEOUT_MS,
    );
    if (prefixOutput === null) return null;
    const output = await this.runLarge(
      ['status', '--porcelain=v1', '-z', '--untracked-files=all'],
      folder,
    );
    if (output === null) return null;
    return GitRepository.parseStatus(output.toString('utf8'), prefixOutput.trim());
  }

  async headContent(folder: string, path: string): Promise<HeadContent> {
    if (!GitRepository.isSafePath(path)) return { ok: false, reason: 'missing' };
    return new Promise((resolve) => {
      execFile(
        'git',
        ['show', `HEAD:./${path}`],
        {
          cwd: folder,
          timeout: GIT_TIMEOUT_MS,
          maxBuffer: CODE_VIEWER_MAX_FILE_BYTES + 1,
          encoding: 'buffer',
        },
        (error, stdout) => {
          if (!error) {
            resolve({ ok: true, data: stdout });
            return;
          }
          const code = (error as NodeJS.ErrnoException).code;
          const tooLarge = code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER';
          resolve({ ok: false, reason: tooLarge ? 'too_large' : 'missing' });
        },
      );
    });
  }

  private static isSafePath(path: string): boolean {
    return (
      path !== '' &&
      !path.startsWith('/') &&
      !path.startsWith('-') &&
      !path.includes('\0') &&
      !path.split('/').includes('..')
    );
  }

  private static parseStatus(output: string, prefix: string): GitStatusEntry[] {
    const fields = output.split('\0');
    const entries: GitStatusEntry[] = [];
    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i] ?? '';
      if (field.length < 4) continue;
      const code = field.slice(0, 2);
      const path = field.slice(3);
      const hasOrigin = code.includes('R') || code.includes('C');
      const origin = hasOrigin ? (fields[(i += 1)] ?? '') : '';
      const status = GitRepository.mapStatus(code);
      const local = GitRepository.stripPrefix(path, prefix);
      if (local === null) continue;
      if (status === 'R') {
        const oldLocal = GitRepository.stripPrefix(origin, prefix);
        entries.push({ path: local, status, ...(oldLocal === null ? {} : { oldPath: oldLocal }) });
      } else {
        entries.push({ path: local, status });
      }
    }
    return entries;
  }

  private static mapStatus(code: string): GitFileStatus {
    if (code === '??') return 'U';
    if (code.includes('D')) return 'D';
    if (code[0] === 'R') return 'R';
    if (code[0] === 'A') return 'A';
    return 'M';
  }

  private static stripPrefix(path: string, prefix: string): string | null {
    if (prefix === '') return path;
    return path.startsWith(prefix) ? path.slice(prefix.length) : null;
  }

  private runLarge(args: string[], folder: string): Promise<Buffer | null> {
    return new Promise((resolve) => {
      execFile(
        'git',
        args,
        {
          cwd: folder,
          timeout: GIT_TIMEOUT_MS,
          maxBuffer: GitRepository.statusMaxBuffer,
          encoding: 'buffer',
        },
        (error, stdout) => resolve(error ? null : stdout),
      );
    });
  }

  private run(
    command: string,
    args: string[],
    folder: string,
    timeout: number,
  ): Promise<string | null> {
    return new Promise((resolve) => {
      execFile(
        command,
        args,
        { cwd: folder, timeout, maxBuffer: GitRepository.maxBuffer, encoding: 'utf8' },
        (error, stdout) => resolve(error ? null : stdout),
      );
    });
  }
}
