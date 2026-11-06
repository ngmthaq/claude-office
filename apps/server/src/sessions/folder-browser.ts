import { readdirSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, sep } from 'node:path';
import type { FolderEntry } from '@claude-office/shared';
import { HOME_DIR } from '../config.ts';

export type FolderErrorCode = 'not_absolute' | 'not_found' | 'outside_home' | 'unreadable';

export type FolderListing = {
  path: string;
  parent: string | null;
  entries: FolderEntry[];
};

export type FolderResult<T> = { ok: true; value: T } | { ok: false; code: FolderErrorCode };

export function listFolders(input?: string): FolderResult<FolderListing> {
  const resolved = resolveFolder(input);
  if (!resolved.ok) return resolved;
  const path = resolved.value;
  const home = realHome();

  try {
    const entries = readdirSync(path, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => ({ name: entry.name, path: join(path, entry.name) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { ok: true, value: { path, parent: path === home ? null : dirname(path), entries } };
  } catch {
    return { ok: false, code: 'unreadable' };
  }
}

/** Resolves a folder to its real path and checks that it is a directory inside home. */
export function resolveFolder(input?: string): FolderResult<string> {
  const home = realHome();
  const target = input ?? home;
  if (!isAbsolute(target)) return { ok: false, code: 'not_absolute' };

  let real: string;
  try {
    real = realpathSync(target);
    if (!statSync(real).isDirectory()) return { ok: false, code: 'not_found' };
  } catch {
    return { ok: false, code: 'not_found' };
  }
  if (real !== home && !real.startsWith(home + sep)) return { ok: false, code: 'outside_home' };
  return { ok: true, value: real };
}

function realHome(): string {
  try {
    return realpathSync(HOME_DIR);
  } catch {
    return HOME_DIR;
  }
}
