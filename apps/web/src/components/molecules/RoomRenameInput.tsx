import { useEffect, useRef, type CSSProperties } from 'react';
import Form from 'react-bootstrap/Form';
import { ROOM_NAME_MAX, roomLabel, type RoomSummary } from '@claude-office/shared';

type RoomRenameInputProps = {
  room: RoomSummary;
  className?: string;
  style?: CSSProperties;
  onSave: (roomId: string, name: string) => void;
  onStop: () => void;
};

export function RoomRenameInput({ room, className, style, onSave, onStop }: RoomRenameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef(false);
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
      onSave(room.id, value);
    }
    onStop();
  }

  return (
    <Form.Control
      ref={inputRef}
      type="text"
      size="sm"
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
