import { create } from 'zustand';
import type { UsageLimit } from '@claude-office/shared';

type UsageLimitState = {
  limit: UsageLimit | null;
  setLimit: (limit: UsageLimit) => void;
};

export const useUsageLimitStore = create<UsageLimitState>((set) => ({
  limit: null,
  setLimit: (limit) => set({ limit }),
}));
