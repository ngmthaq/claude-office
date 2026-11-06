import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const HOST = '127.0.0.1';
export const PORT = Number(process.env.PORT) || 4317;
export const SERVER_VERSION = '0.0.0';
export const DATA_DIR = fileURLToPath(new URL('../../data', import.meta.url));
export const ALLOWED_ORIGINS: readonly string[] = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:4317',
];
export const HOME_DIR = homedir();
