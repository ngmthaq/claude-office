import { useEffect, useRef, type RefObject } from 'react';

/** Scrolls the returned ref's element into view whenever `dependency` changes. */
export function useAutoScroll(dependency: unknown): RefObject<HTMLDivElement | null> {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [dependency]);

  return endRef;
}
