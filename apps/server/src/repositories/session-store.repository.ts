import type { PermissionResult, Query } from '@anthropic-ai/claude-agent-sdk';
import {
  EMPTY_SESSION_INFO,
  type PermissionMode,
  type RoomEvent,
  type SessionInfo,
  type SessionState,
} from '@claude-office/shared';
import type { RoomSummary, SubagentRef } from '@claude-office/shared';
import type { RoomRow } from '@/dtos/room-row.dto.ts';
import type { InputQueue } from '@/utils/input-queue.util.ts';

export type SubagentState = {
  agentType: string;
  description: string;
  toolEvents: number;
  hiddenToolCalls: number;
  shownCalls: Set<string>;
  backgrounded: boolean;
  taskId: string | null;
};

export type MapperState = {
  /** API message id of the assistant message that is streaming right now. */
  messageId: string;
  /** Active sub-agents by their `Agent` tool call id, in start order. */
  subagents: Map<string, SubagentState>;
  /** Task ids that already got a result card. */
  cardedTasks: Set<string>;
};

export type PendingPermission = {
  toolName: string;
  input: Record<string, unknown>;
  resolve: (result: PermissionResult) => void;
  detach: () => void;
};

export type Session = {
  id: string;
  name: string | null;
  title: string | null;
  folder: string;
  createdAt: number;
  sessionId: string | null;
  resumedFrom: string | null;
  busy: boolean;
  state: SessionState;
  events: RoomEvent[];
  input: InputQueue | null;
  query: Query | null;
  closed: boolean;
  historyLoaded: boolean;
  historyLoading: Promise<void> | null;
  stopTimer: NodeJS.Timeout | null;
  mapper: MapperState;
  pending: Map<string, PendingPermission>;
  terminalCommands: Set<string>;
  permissionMode: PermissionMode;
  info: SessionInfo;
};

export class SessionStoreRepository {
  private readonly sessions = new Map<string, Session>();

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  set(id: string, session: Session): void {
    this.sessions.set(id, session);
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  values(): IterableIterator<Session> {
    return this.sessions.values();
  }

  get size(): number {
    return this.sessions.size;
  }

  closedSession(row: RoomRow, sessionId: string, mapper: MapperState): Session {
    return {
      id: row.id,
      name: row.name,
      title: row.title,
      folder: row.folder,
      createdAt: row.createdAt,
      sessionId,
      resumedFrom: sessionId,
      busy: false,
      state: 'closed',
      events: [],
      input: null,
      query: null,
      closed: true,
      historyLoaded: false,
      historyLoading: null,
      stopTimer: null,
      mapper,
      pending: new Map(),
      terminalCommands: new Set(),
      permissionMode: row.permissionMode,
      info: { ...EMPTY_SESSION_INFO },
    };
  }

  toSummary(session: Session, subagents: SubagentRef[]): RoomSummary {
    return {
      id: session.id,
      name: session.name,
      title: session.title,
      folder: session.folder,
      createdAt: session.createdAt,
      sessionId: session.sessionId,
      busy: session.busy,
      state: session.state,
      subagents,
      permissionMode: session.permissionMode,
      info: session.info,
    };
  }

  findBySessionId(sessionId: string): Session | undefined {
    for (const session of this.sessions.values()) {
      if (session.sessionId === sessionId || session.resumedFrom === sessionId) return session;
    }
    return undefined;
  }
}
