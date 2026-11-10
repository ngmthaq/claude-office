export const INTERNAL_EVENT_NAMES: ReadonlySet<string> = new Set([
  'init',
  'status',
  'hook_started',
  'hook_progress',
  'hook_response',
  'tool_progress',
  'task_progress',
  'task_updated',
  'background_tasks_changed',
  'session_state_changed',
  'thinking_tokens',
  'rate_limit_event',
  'api_retry',
  'commands_changed',
  'files_persisted',
  'control_request_progress',
  'plugin_install',
  'tool_use_summary',
  'prompt_suggestion',
  'memory_recall',
  'permission_denied',
  'worker_shutting_down',
  'turn_duration',
  'stop_hook_summary',
  'away_summary',
  'bridge_status',
  'informational',
]);

export const COMPACT_SUMMARY_PREFIX =
  'This session is being continued from a previous conversation';
export const COMPACTED_OUTPUT_PREFIX = 'Compacted';
export const COMPACT_EVENT_NAME = 'compact_boundary';
export const LOCAL_COMMAND_EVENT_NAME = 'local_command_output';
