export const SETTING_SOURCES: readonly ('user' | 'project' | 'local')[] = [
  'user',
  'project',
  'local',
];
export const SDK_EXTRA_ARGS: Record<string, string | null> = { chrome: null };
export const PERMISSION_DENY_MESSAGE = 'The user denied this tool in Claude Office.';
export const ASK_IN_CHAT_MESSAGE =
  'Claude Office cannot show this prompt yet. Ask your question as plain chat text instead, and wait for the reply.';
export const ASK_IN_CHAT_TOOLS: readonly string[] = ['AskUserQuestion', 'ExitPlanMode'];
