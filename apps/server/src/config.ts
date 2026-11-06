import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { ROOM_NAME_MAX } from '@claude-office/shared';

export const HOST = '127.0.0.1';
export const PORT = Number(process.env.PORT) || 4317;
export const SERVER_VERSION = '0.0.0';
export const DATA_DIR = fileURLToPath(new URL('../data', import.meta.url));
export const DB_PATH = `${DATA_DIR}/claude-office.db`;
export const MIGRATIONS_DIR = fileURLToPath(new URL('./db/migrations', import.meta.url));
export const ALLOWED_ORIGINS: readonly string[] = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:4317',
];
export const HOME_DIR = homedir();
export const ROOM_EVENT_BUFFER_MAX = 2000;
export const STOP_TIMEOUT_MS = 5000;
export const TOOL_RESULT_MAX_CHARS = 4000;
export const SUBAGENT_TOOL_EVENTS_MAX = 200;
export const HISTORY_TEXT_MAX = 200;
export { ROOM_NAME_MAX };
export const SETTING_SOURCES: readonly ('user' | 'project' | 'local')[] = [
  'user',
  'project',
  'local',
];
export const PERMISSION_DENY_MESSAGE = 'The user denied this tool in Claude Office.';
export const ASK_IN_CHAT_MESSAGE =
  'Claude Office cannot show this prompt yet. Ask your question as plain chat text instead, and wait for the reply.';
export const ASK_IN_CHAT_TOOLS: readonly string[] = ['AskUserQuestion', 'ExitPlanMode'];
