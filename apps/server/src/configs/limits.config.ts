import { ROOM_NAME_MAX } from '@claude-office/shared';

export const ROOM_EVENT_BUFFER_MAX = 2000;
export const STOP_TIMEOUT_MS = 5000;
export const TOOL_RESULT_MAX_CHARS = 4000;
export const SUBAGENT_TOOL_EVENTS_MAX = 200;
export const HISTORY_TEXT_MAX = 200;
export const TASK_TITLE_MAX = 80;
export const COMMANDS_TIMEOUT_MS = 2000;
export const MCP_STATUS_TIMEOUT_MS = 5000;
export const CODE_VIEWER_MAX_FILE_BYTES = 1024 * 1024;
export { ROOM_NAME_MAX };
export const TRANSCRIPT_READ_DELAY_MS = 250;
export const TRANSCRIPT_READ_RETRIES = 4;
export const ATTACHED_FILE_TAG = 'attached-file';
export const ATTACHED_FILE_TAG_PREFIX = `<${ATTACHED_FILE_TAG} `;
export const WS_MAX_PAYLOAD_BYTES = 30 * 1024 * 1024;
