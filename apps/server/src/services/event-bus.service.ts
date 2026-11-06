import type { RoomEvent, SessionState, SessionStateEvent } from '@claude-office/shared';
import { ROOM_EVENT_BUFFER_MAX } from '@/configs/limits.config.ts';
import type { Session } from '@/repositories/session-store.repository.ts';
import { SessionMapperUtil } from '@/utils/session-mapper.util.ts';

export type RoomEventListener = (event: RoomEvent) => void;
export type SessionStateListener = (event: SessionStateEvent) => void;

export class EventBusService {
  private readonly eventListeners = new Set<RoomEventListener>();
  private readonly stateListeners = new Set<SessionStateListener>();
  private readonly changeListeners = new Set<() => void>();
  private readonly archivedListeners = new Set<() => void>();

  onRoomEvent(listener: RoomEventListener): void {
    this.eventListeners.add(listener);
  }

  onSessionState(listener: SessionStateListener): void {
    this.stateListeners.add(listener);
  }

  onRoomsChanged(listener: () => void): void {
    this.changeListeners.add(listener);
  }

  onArchivedChanged(listener: () => void): void {
    this.archivedListeners.add(listener);
  }

  emit(session: Session, event: RoomEvent): void {
    session.events.push(event);
    if (session.events.length > ROOM_EVENT_BUFFER_MAX) session.events.shift();
    for (const listener of this.eventListeners) listener(event);
  }

  updateState(session: Session, busyChanged = false): void {
    const state: SessionState = session.closed
      ? 'closed'
      : !(session.busy || session.mapper.subagents.size > 0)
        ? 'idle'
        : session.pending.size > 0
          ? 'waiting'
          : 'working';
    if (state === session.state && !busyChanged) return;
    session.state = state;
    const event: SessionStateEvent = { type: 'session_state', roomId: session.id, state };
    for (const listener of this.stateListeners) listener(event);
    this.notifyChanged();
  }

  emitUnknownRoom(roomId: string): void {
    const event = SessionMapperUtil.errorEvent(roomId, 'room_not_found', 'Room not found.');
    for (const listener of this.eventListeners) listener(event);
  }

  notifyChanged(): void {
    for (const listener of this.changeListeners) listener();
  }

  notifyArchivedChanged(): void {
    for (const listener of this.archivedListeners) listener();
  }
}
