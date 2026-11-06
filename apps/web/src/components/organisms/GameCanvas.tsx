import { useEffect, useRef } from 'react';
import type { Application } from 'pixi.js';
import { RoomRenameInput } from '@/components/molecules/RoomRenameInput';
import { loadSheets } from '@/game/asset-loader';
import { OfficeScene } from '@/game/office-scene';
import { createPixiApp } from '@/game/pixi-app';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';

export function GameCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const isEmpty = useSessionsStore((state) => state.rooms.length === 0);
  const renaming = useSessionsStore((state) => state.renaming);
  const stopRename = useSessionsStore((state) => state.stopRename);
  const renamingRoom = useSessionsStore((state) =>
    state.renaming ? state.rooms.find((r) => r.id === state.renaming?.roomId) : undefined,
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let app: Application | null = null;
    let scene: OfficeScene | null = null;
    let observer: ResizeObserver | null = null;

    const mount = async () => {
      const created = await createPixiApp(host);
      // Cleanup may run while init is pending (StrictMode); destroy right away.
      if (cancelled) {
        created.destroy(true, { children: true });
        return;
      }
      app = created;

      await loadSheets();
      if (cancelled) return;

      host.appendChild(created.canvas);
      scene = new OfficeScene(created);
      // resizeTo only listens to the window, so watch the host for panel open and close.
      observer = new ResizeObserver(() => created.resize());
      observer.observe(host);
    };

    void mount().catch((error: unknown) => console.error('Failed to start the game canvas', error));

    return () => {
      cancelled = true;
      observer?.disconnect();
      scene?.destroy();
      scene = null;
      if (app) {
        app.destroy(true, { children: true });
        app = null;
      }
    };
  }, []);

  return (
    <div className="game-canvas">
      <div ref={hostRef} className="game-canvas__host" />
      {renaming?.place === 'office' && renaming.rect && renamingRoom && (
        <RoomRenameInput
          key={renamingRoom.id}
          room={renamingRoom}
          className="map-rename"
          onSave={(roomId, name) => wsClientService.send({ type: 'room_rename', roomId, name })}
          onStop={stopRename}
          style={{
            left: renaming.rect.x + renaming.rect.width / 2,
            top: renaming.rect.y - 2,
            height: renaming.rect.height + 4,
          }}
        />
      )}
      {isEmpty && <p className="game-canvas__hint muted">Start a session to begin</p>}
    </div>
  );
}
