import { create } from 'zustand';
import { CHAT_WIDTH_STORAGE_KEY, MAX_REM, MIN_REM } from '@/configs/layout.config';
import { ChatWidthUtil } from '@/utils/chat-width.util';

type ChatWidthState = {
  width: number;
  setWidth: (px: number) => void;
  reset: () => void;
  persist: () => void;
};

export const useChatWidthStore = create<ChatWidthState>((set, get) => ({
  width: loadInitialWidth(),
  setWidth: (px) => set({ width: ChatWidthUtil.clampWidth(px, ChatWidthUtil.getBounds()) }),
  reset: () => set({ width: ChatWidthUtil.getBounds().min }),
  persist: () => {
    try {
      localStorage.setItem(CHAT_WIDTH_STORAGE_KEY, String(get().width));
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
    const stored = Number(localStorage.getItem(CHAT_WIDTH_STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      return ChatWidthUtil.clampWidth(stored, { min, max: MAX_REM * rem });
    }
  } catch {
    return min;
  }
  return min;
}
