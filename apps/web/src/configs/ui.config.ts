import type { McpServerStatusValue, PermissionMode } from '@claude-office/shared';
import type { ConnectionStatus } from '@/dtos/connection-status.dto';
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
