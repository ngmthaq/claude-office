import { useCallback } from 'react';
import { useMcpStore } from '@/hooks/store/useMcpStore';
import { wsClientService } from '@/services/ws-client.service';

type McpStatus = {
  openPanel: (roomId: string) => void;
  refresh: (roomId: string) => void;
};

export function useMcpStatus(): McpStatus {
  const setOpenRoomId = useMcpStore((state) => state.setOpenRoomId);
  const markLoading = useMcpStore((state) => state.markLoading);

  const refresh = useCallback(
    (roomId: string) => {
      markLoading(roomId);
      wsClientService.send({ type: 'mcp_list', roomId });
    },
    [markLoading],
  );

  const openPanel = useCallback(
    (roomId: string) => {
      setOpenRoomId(roomId);
      refresh(roomId);
    },
    [setOpenRoomId, refresh],
  );

  return { openPanel, refresh };
}
