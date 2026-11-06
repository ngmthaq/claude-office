import { create } from 'zustand';
import type { HelloEvent } from '@claude-office/shared';
import type { ConnectionStatus } from '@/dtos/connection-status.dto';

type ConnectionState = {
  status: ConnectionStatus;
  hello: HelloEvent | null;
  setStatus: (status: ConnectionStatus) => void;
  setHello: (hello: HelloEvent) => void;
};

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'connecting',
  hello: null,
  setStatus: (status) => set({ status }),
  setHello: (hello) => set({ hello }),
}));
