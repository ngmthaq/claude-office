import { useEffect, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { WidthBounds } from '@/features/chat/use-chat-width-store';
import { getBounds, useChatWidthStore } from '@/features/chat/use-chat-width-store';

const DRAGGING_CLASS = 'chat-resizing';

type DragState = { startX: number; startWidth: number; pointerId: number };

export function ChatResizeHandle() {
  const width = useChatWidthStore((state) => state.width);
  const dragRef = useRef<DragState | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingXRef = useRef(0);
  const bounds = getBounds();

  useEffect(() => () => endDragEffects(frameRef), []);

  // The initial width is read before the layout exists, so clamp it against the real layout once.
  useEffect(() => {
    const { width: current, setWidth } = useChatWidthStore.getState();
    setWidth(current);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startWidth: useChatWidthStore.getState().width,
      pointerId: event.pointerId,
    };
    document.body.classList.add(DRAGGING_CLASS);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    pendingXRef.current = event.clientX;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const drag = dragRef.current;
      if (!drag) return;
      useChatWidthStore.getState().setWidth(drag.startWidth + (drag.startX - pendingXRef.current));
    });
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(drag.pointerId)) {
      event.currentTarget.releasePointerCapture(drag.pointerId);
    }
    endDragEffects(frameRef);
    useChatWidthStore.getState().persist();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { width: current, setWidth, persist } = useChatWidthStore.getState();
    const currentBounds = getBounds();
    const step = currentBounds.min / 30;
    const next = nextWidth(event.key, current, step, currentBounds);
    if (next === null) return;
    event.preventDefault();
    setWidth(next);
    persist();
  };

  const onDoubleClick = () => {
    useChatWidthStore.getState().reset();
    useChatWidthStore.getState().persist();
  };

  return (
    <div
      className="chat-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize chat panel"
      aria-valuemin={Math.round(bounds.min)}
      aria-valuemax={Math.round(bounds.max)}
      aria-valuenow={Math.round(width)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    />
  );
}

function nextWidth(key: string, current: number, step: number, bounds: WidthBounds): number | null {
  switch (key) {
    case 'ArrowLeft':
      return current + step;
    case 'ArrowRight':
      return current - step;
    case 'Home':
      return bounds.min;
    case 'End':
      return bounds.max;
    default:
      return null;
  }
}

function endDragEffects(frameRef: { current: number | null }) {
  if (frameRef.current !== null) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }
  document.body.classList.remove(DRAGGING_CLASS);
}
