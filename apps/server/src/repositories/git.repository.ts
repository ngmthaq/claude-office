import { execFile } from 'node:child_process';
import type { GitProvider } from '@claude-office/shared';
import { z } from 'zod';
import {
  GH_TIMEOUT_MS,
  GIT_HOST_PROVIDERS,
  GIT_TIMEOUT_MS,
  GLAB_TIMEOUT_MS,
} from '@/configs/git.config.ts';

export type PrInfo = { number: number; url: string };

type PrCommand = {
  command: string;
  args: string[];
  timeout: number;
  parse: (json: unknown) => PrInfo | null;
};

export class GitRepository {
  private static readonly maxBuffer = 1024 * 1024;
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
