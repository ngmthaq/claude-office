import { useEffect, useRef, type CSSProperties } from 'react';
import { ROOM_NAME_MAX, roomLabel, type RoomSummary } from '@claude-office/shared';
import { sendClientEvent } from '@/features/connection/ws-client';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

type RoomRenameInputProps = {
  room: RoomSummary;
  className?: string;
  style?: CSSProperties;
};

export function RoomRenameInput({ room, className, style }: RoomRenameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef(false);
  const stopRename = useSessionsStore((state) => state.stopRename);
  const initial = roomLabel(room);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function finish(save: boolean): void {
    if (doneRef.current) return;
    doneRef.current = true;
    const value = inputRef.current?.value.trim() ?? initial;
    if (save && value !== initial) {
      sendClientEvent({ type: 'room_rename', roomId: room.id, name: value });
    }
    stopRename();
  }

  return (
    <input
      ref={inputRef}
      type="text"
      className={className}
      style={style}
      defaultValue={initial}
      maxLength={ROOM_NAME_MAX}
      aria-label={`Rename ${initial}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          finish(true);
        } else if (event.key === 'Escape') {
          event.stopPropagation();
          finish(false);
        }
      }}
      onBlur={() => finish(false)}
    />
  );
}
