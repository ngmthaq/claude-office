import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVER_PACKAGE_NAME = '@claude-office/server';

const findServerRoot = (): string => {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const packagePath = join(dir, 'package.json');
    if (existsSync(packagePath)) {
      const { name } = JSON.parse(readFileSync(packagePath, 'utf8')) as { name?: string };
      if (name === SERVER_PACKAGE_NAME) return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) throw new Error('server package root not found');
    dir = parent;
  }
};

export const HOST = '127.0.0.1';
export const PORT = Number(process.env.PORT) || 4317;
export const SERVER_VERSION = '0.0.0';
const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];
const DEFAULT_LOG_LEVEL: LogLevel = 'info';

const readLogLevel = (): LogLevel => {
  const value = process.env.LOG_LEVEL;
  return LOG_LEVELS.find((level) => level === value) ?? DEFAULT_LOG_LEVEL;
};

export const LOG_LEVEL: LogLevel = readLogLevel();
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Env override wins; the server package root is only searched for when it is unset. */
export const resolveDir = (envName: string, fromServerRoot: (root: string) => string): string =>
  process.env[envName] || fromServerRoot(findServerRoot());

export const DATA_DIR = resolveDir('CLAUDE_OFFICE_DATA_DIR', (root) => join(root, 'data'));
export const WEB_DIST_DIR = resolveDir('CLAUDE_OFFICE_WEB_DIST_DIR', (root) =>
  join(root, '..', 'web', 'dist'),
);
export const ALLOWED_ORIGINS: readonly string[] = [
  ...new Set(
    [5173, PORT].flatMap((port) => [`http://127.0.0.1:${port}`, `http://localhost:${port}`]),
  ),
];
export const HOME_DIR = homedir();
