import type { GitProvider, McpServerStatusValue, PermissionMode } from '@claude-office/shared';
import type { ConnectionStatus } from '@/dtos/connection-status.dto';
import type { ReportStatus } from '@/utils/report-status.util';
import type { SubagentItem } from '@/dtos/subagent-item.dto';

export type ModeOption = { value: PermissionMode; label: string; icon: string };

export const PERMISSION_STATUS_LABELS = {
  allow: 'Allowed',
  deny: 'Denied',
  cancelled: 'Cancelled',
} as const;

export const PERMISSION_STATUS_BG = {
  allow: 'success',
  deny: 'danger',
  cancelled: 'secondary',
} as const;

export const SUBAGENT_STATUS_BG: Record<SubagentItem['status'], string> = {
  working: 'info',
  done: 'success',
  error: 'danger',
  stopped: 'secondary',
};

export const REPORT_STATUS_BG: Record<ReportStatus | 'report', string> = {
  complete: 'success',
  incomplete: 'warning',
  blocked: 'danger',
  done: 'success',
  failed: 'danger',
  stopped: 'secondary',
  report: 'secondary',
};

export const TASK_STATUS_BADGE = {
  completed: 'done',
  failed: 'failed',
  killed: 'stopped',
} as const;

export const TASK_TITLE_PREFIX = 'Result: ';

export const PEER_CARD_TEXT = {
  resultLabel: 'Result',
  messageLabel: 'Message',
  taskDetailFallback: 'Sub-agent result',
  handbackDetailFallback: 'sub-agent',
  peerDetailFallback: 'another session',
  reportHeading: 'Report',
  reportBadge: 'report',
  openSubagent: 'Open sub-agent',
} as const;

export const TOOL_STATUS_BG: Record<'running' | 'stopped' | 'error' | 'done', string> = {
  running: 'info',
  stopped: 'secondary',
  error: 'danger',
  done: 'success',
};

export const CONNECTION_STATUS_BG: Record<ConnectionStatus, string> = {
  connected: 'success',
  connecting: 'warning',
  disconnected: 'danger',
};

export const MCP_STATUS_BG: Record<McpServerStatusValue, string> = {
  connected: 'success',
  'needs-auth': 'warning',
  failed: 'danger',
  pending: 'secondary',
  disabled: 'secondary',
};

export const MCP_STATUS_LABEL: Record<McpServerStatusValue, string> = {
  connected: 'connected',
  'needs-auth': 'needs login',
  failed: 'failed',
  pending: 'connecting',
  disabled: 'disabled',
};

export const MCP_STATUS_ORDER: McpServerStatusValue[] = [
  'connected',
  'pending',
  'needs-auth',
  'failed',
  'disabled',
];

export const PERMISSION_MODE_BY_VALUE: Record<PermissionMode, ModeOption> = {
  default: { value: 'default', label: 'Ask permission', icon: 'shield-check' },
  acceptEdits: { value: 'acceptEdits', label: 'Accept edits', icon: 'pencil-square' },
  auto: { value: 'auto', label: 'Auto', icon: 'magic' },
};

export const PERMISSION_MODE_OPTIONS = Object.values(PERMISSION_MODE_BY_VALUE);

export const PR_LABEL_BY_PROVIDER: Record<GitProvider, string> = {
  github: 'PR #',
  gitlab: 'MR !',
};

export const PR_TITLE_BY_PROVIDER: Record<GitProvider, string> = {
  github: 'Pull request',
  gitlab: 'Merge request',
};

export const SESSION_INFO_TEXT = {
  empty: '—',
  title: 'Session info',
  folder: 'Working dir',
  branch: 'Branch',
  pr: 'Pull request',
  model: 'Model',
  effort: 'Effort',
  context: 'Context',
  back: 'Back to chat',
} as const;
