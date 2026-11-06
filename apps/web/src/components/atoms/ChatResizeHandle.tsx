import type { KeyboardEvent, PointerEvent } from 'react';

type ChatResizeHandleProps = {
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export function ChatResizeHandle({
  ariaValueMin,
  ariaValueMax,
  ariaValueNow,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onDoubleClick,
  onKeyDown,
}: ChatResizeHandleProps) {
  return (
    <div
      className="chat-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize chat panel"
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    />
  );
}
