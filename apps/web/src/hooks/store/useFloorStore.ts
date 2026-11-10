import { create } from 'zustand';
import { FLOOR_VISIBLE_STORAGE_KEY } from '@/configs/layout.config';

type FloorState = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const useFloorStore = create<FloorState>((set) => ({
  visible: loadInitialVisible(),
  setVisible: (visible) => {
    set({ visible });
    try {
      localStorage.setItem(FLOOR_VISIBLE_STORAGE_KEY, String(visible));
    } catch {
      // Storage can be blocked; the choice then lasts for this page only.
    }
  },
}));

function loadInitialVisible(): boolean {
  try {
    return localStorage.getItem(FLOOR_VISIBLE_STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}
