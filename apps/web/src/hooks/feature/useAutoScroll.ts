import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from 'react';
import {
  AUTO_SCROLL_AT_END_TOLERANCE_PX,
  AUTO_SCROLL_BOTTOM_THRESHOLD_PX,
} from '@/configs/ui.config';

type AutoScroll = {
  containerRef: RefObject<HTMLDivElement | null>;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  atBottom: boolean;
  scrollToBottom: () => void;
};

/**
 * Keeps the container scrolled to the bottom when `dependency` changes, but only
 * while the user is at the bottom. Scrolling up turns it off; reaching the bottom turns it on.
 */
export function useAutoScroll(dependency: unknown): AutoScroll {
  const containerRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const [atBottom, setAtBottom] = useState(true);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (element === null || !followRef.current) return;
    element.scrollTop = element.scrollHeight;
    lastScrollTopRef.current = element.scrollTop;
  }, [dependency]);

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>): void => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    const distance = scrollHeight - scrollTop - clientHeight;
    const movedUp = scrollTop < lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop;
    if (movedUp && distance > AUTO_SCROLL_AT_END_TOLERANCE_PX) {
      followRef.current = false;
    } else if (distance <= AUTO_SCROLL_BOTTOM_THRESHOLD_PX) {
      followRef.current = true;
    }
    setAtBottom(followRef.current);
  }, []);

  const scrollToBottom = useCallback((): void => {
    followRef.current = true;
    setAtBottom(true);
    const element = containerRef.current;
    if (element === null) return;
    element.scrollTop = element.scrollHeight;
    lastScrollTopRef.current = element.scrollTop;
  }, []);

  return { containerRef, onScroll, atBottom, scrollToBottom };
}
