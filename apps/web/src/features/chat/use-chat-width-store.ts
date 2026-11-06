import { create } from 'zustand';

const STORAGE_KEY = 'claude-office.chatWidth';
const MIN_REM = 30;
const MAX_REM = 50;
const MIN_CANVAS_REM = 20;

export type WidthBounds = { min: number; max: number };

type ChatWidthState = {
  width: number;
  setWidth: (px: number) => void;
  reset: () => void;
  persist: () => void;
};

export function clampWidth(px: number, bounds: WidthBounds): number {
  return Math.round(Math.min(Math.max(px, bounds.min), Math.max(bounds.min, bounds.max)));
}

export function getBounds(): WidthBounds {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const min = MIN_REM * rem;
  const body = document.querySelector('.app-body');
  if (!body) return { min, max: MAX_REM * rem };
  const sidebar = document.querySelector('.sidebar');
  const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 0;
  const space = body.clientWidth - sidebarWidth - MIN_CANVAS_REM * rem;
  return { min, max: Math.max(min, Math.min(MAX_REM * rem, space)) };
}

export const useChatWidthStore = create<ChatWidthState>((set, get) => ({
  width: loadInitialWidth(),
  setWidth: (px) => set({ width: clampWidth(px, getBounds()) }),
  reset: () => set({ width: getBounds().min }),
  persist: () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(get().width));
    } catch {
      // Storage can be blocked; the width then lasts for this page only.
    }
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const { width, setWidth } = useChatWidthStore.getState();
    setWidth(width);
  });
}

function loadInitialWidth(): number {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const min = MIN_REM * rem;
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      return clampWidth(stored, { min, max: MAX_REM * rem });
    }
  } catch {
    return min;
  }
  return min;
}
