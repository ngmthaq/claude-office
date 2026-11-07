import { useCallback, useEffect, useRef } from 'react';
import { useCodeViewerStore } from '@/hooks/store/useCodeViewerStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';

export function useCodeViewerRefresh() {
  const roomId = useCodeViewerStore((state) => state.openRoomId);
  const roomState = useSessionsStore(
    (state) => state.rooms.find((r) => r.id === roomId)?.state ?? null,
  );
  const previousState = useRef(roomState);

  const requestTree = useCallback(() => {
    if (roomId === null) return;
    useCodeViewerStore.getState().startLoadingTree();
    wsClientService.send({ type: 'code_tree_list', roomId });
  }, [roomId]);

  const requestFile = useCallback(
    (path: string) => {
      if (roomId === null) return;
      wsClientService.send({ type: 'code_file_get', roomId, path });
    },
    [roomId],
  );

  const refresh = useCallback(() => {
    requestTree();
    const path = useCodeViewerStore.getState().selectedPath;
    if (path !== null) {
      useCodeViewerStore.getState().startLoadingFile();
      requestFile(path);
    }
  }, [requestTree, requestFile]);

  useEffect(() => {
    if (roomId !== null) requestTree();
  }, [roomId, requestTree]);

  useEffect(() => {
    const was = previousState.current;
    previousState.current = roomState;
    if (roomId !== null && was === 'working' && roomState !== 'working') refresh();
  }, [roomState, roomId, refresh]);

  return { requestFile, refresh };
}
