import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKAGE_NAME = '@ngmthaq20/claude-office';
export const BIN_NAME = 'claude-office';
export const DEFAULT_PORT = 4317;
export const HOST = '127.0.0.1';
export const MIN_NODE_MAJOR = 24;
export const READY_TIMEOUT_MS = 20_000;
export const READY_POLL_MS = 200;

// dist/cli.js sits directly in the package's dist folder
const DIST_DIR = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(homedir(), `.${PACKAGE_NAME.replace('/', '-')}`);
export const SERVER_MAIN_FILE = join(DIST_DIR, 'server', 'main.js');
export const SERVER_MIGRATE_FILE = join(DIST_DIR, 'server', 'migrate.js');
export const MIGRATIONS_DIR = join(DIST_DIR, 'server', 'migrations');
export const WEB_DIST_DIR = join(DIST_DIR, 'web');
export const PACKAGE_VERSION = (
  JSON.parse(readFileSync(join(DIST_DIR, '..', 'package.json'), 'utf8')) as { version: string }
).version;
