import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type LogWriter = {
  path: string;
  write: (entry: unknown) => void;
};

const LOGS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'logs');

export function createLogWriter(scriptName: string): LogWriter {
  mkdirSync(LOGS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = join(LOGS_DIR, `${scriptName}-${stamp}.jsonl`);
  return {
    path,
    write: (entry) => appendFileSync(path, `${JSON.stringify(entry)}\n`),
  };
}
