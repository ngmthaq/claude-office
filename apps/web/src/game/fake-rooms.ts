import type { RoomSummary, SessionState } from '@claude-office/shared';
import { FAKE_ROOM_PREFIX, useSessionsStore } from '@/features/sessions/use-sessions-store';

const MAX_FAKE_ROOMS = 50;
const CYCLE_MS = 3000;
const STATES: readonly SessionState[] = ['idle', 'working', 'waiting', 'closed'];

export function startFakeRooms(requested: number): () => void {
  const count = Math.min(Math.max(Math.floor(requested), 0), MAX_FAKE_ROOMS);
  const now = Date.now();
  const rooms: RoomSummary[] = Array.from({ length: count }, (_, index) => ({
    id: `${FAKE_ROOM_PREFIX}${index + 1}`,
    name: null,
    folder: `/fake/project-${index + 1}`,
    createdAt: now + index,
    sessionId: null,
    busy: false,
    state: stateAt(index),
    subagents: [],
  }));
  useSessionsStore.getState().setFakeRooms(rooms);

  let step = 0;
  const timer = setInterval(() => {
    step += 1;
    const { applySessionState } = useSessionsStore.getState();
    rooms.forEach((room, index) => {
      applySessionState(room.id, stateAt(index + step));
    });
  }, CYCLE_MS);

  return () => {
    clearInterval(timer);
    useSessionsStore.getState().setFakeRooms([]);
  };
}

function stateAt(index: number): SessionState {
  return STATES[index % STATES.length] ?? 'idle';
}
