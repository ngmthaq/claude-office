import {
  ATTACHMENT_IMAGE_MEDIA_TYPES,
  ATTACHMENT_PDF_MEDIA_TYPE,
  ATTACHMENT_TEXT_EXTENSIONS,
  type GitProvider,
  type McpServerStatusValue,
  type PermissionMode,
} from '@claude-office/shared';
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

export const USAGE_LIMIT_TEXT = {
  resetsIn: 'resets in',
  resetNow: 'reset',
  used: 'used',
  titleAt: '5-hour limit resets at',
  titleDefault: '5-hour usage limit',
} as const;

export const CODE_VIEWER_TEXT = {
  title: 'Code viewer',
  diff: 'Diff',
  file: 'File',
  modeLabel: 'View mode',
  refresh: 'Refresh',
  files: 'Files',
  selectFile: 'Select a file',
  tooLarge: 'Cannot preview: file is larger than 1 MB',
  binary: 'Cannot preview: binary file',
  notFound: 'File not found',
  truncated: 'List is cut at 5000 entries',
  noGit: 'Not a git repository — no change marks',
} as const;

export const ATTACHMENT_ACCEPT = [
  ...ATTACHMENT_IMAGE_MEDIA_TYPES,
  ATTACHMENT_PDF_MEDIA_TYPE,
  ...ATTACHMENT_TEXT_EXTENSIONS.map((extension) => `.${extension}`),
].join(',');

export const ATTACHMENT_RESIZE = {
  maxEdge: 1568,
  quality: 0.85,
  shrinkFactor: 0.8,
  maxAttempts: 8,
} as const;

export const ATTACHMENT_SEND_TIMEOUT_MS = 10000;

export const ATTACHMENT_TEXT = {
  add: 'Attach files',
  remove: 'Remove',
  dropHint: 'Drop files to attach',
  typeNotSupported: 'Type not supported',
  empty: 'File is empty',
  tooMany: 'Too many files',
  totalOver: 'Total size over limit',
  readFailed: 'Could not read file',
  resizeFailed: 'Could not shrink image',
  tooBig: 'File too big',
  sendFailed: 'Could not send the files. Try again.',
} as const;

export const SYSTEM_EVENT_TEXT = {
  errorLabel: 'error',
  emptyContent: '(no content)',
} as const;

export const INTERNAL_EVENTS_TEXT = {
  summary: (total: number): string => `${total} internal ${total === 1 ? 'event' : 'events'}`,
  olderHidden: (hidden: number): string =>
    `${hidden} older ${hidden === 1 ? 'item is' : 'items are'} not shown.`,
} as const;

export const INTERNAL_ITEMS_KEEP_MAX = 50;

export const AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 32;
export const AUTO_SCROLL_AT_END_TOLERANCE_PX = 1;
export const SCROLL_TO_BOTTOM_LABEL = 'Scroll to bottom';

export const FLOOR_TEXT = {
  toggleLabel: 'Show floor',
  emptyChat: 'Select a session to start chatting',
} as const;
