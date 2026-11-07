import { Container, type Application, type Text, type Ticker } from 'pixi.js';
import type { RoomSummary } from '@claude-office/shared';
import type { ScreenRect } from '@/dtos/rename-target.dto';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { CameraController, type WorldRect } from './camera-controller';
import { RoomView } from './room-view';

export class OfficeScene {
  private static readonly gapX = 16;
  private static readonly gapY = 28;
  private static readonly labelOffsetPx = 2;

  private readonly world = new Container();
  private readonly labelLayer = new Container();
  private readonly camera: CameraController;
  private readonly views = new Map<string, RoomView>();
  private readonly animated = new Set<RoomView>();
  private layoutKey = '';
  private bounds: WorldRect | null = null;
  private ticking = false;
  private readonly unsubscribe: () => void;

  constructor(private readonly app: Application) {
    this.labelLayer.eventMode = 'passive';
    app.stage.addChild(this.world, this.labelLayer);
    this.camera = new CameraController(app, this.world, this.handleCameraChange);

    const initial = useSessionsStore.getState();
    this.syncRooms(initial.rooms);
    this.frame(false);

    this.unsubscribe = useSessionsStore.subscribe((state, previous) => {
      if (state.rooms !== previous.rooms) this.syncRooms(state.rooms);
      if (state.selectedRoomId !== previous.selectedRoomId) {
        this.frame(true);
        this.updateSubagentLabels();
      }
    });
  }

  destroy(): void {
    this.unsubscribe();
    this.camera.destroy();
    this.stopTicking();
    this.animated.clear();
    for (const view of this.views.values()) view.destroy();
    this.views.clear();
    this.world.destroy({ children: true });
    this.labelLayer.destroy({ children: true });
  }

  private syncRooms(rooms: RoomSummary[]): void {
    const sorted = [...rooms].sort((a, b) => a.createdAt - b.createdAt);
    const liveIds = new Set(sorted.map((room) => room.id));

    for (const [id, view] of this.views) {
      if (liveIds.has(id)) continue;
      this.animated.delete(view);
      view.destroy();
      this.views.delete(id);
    }

    const columns = Math.max(1, Math.ceil(Math.sqrt(sorted.length)));
    sorted.forEach((room, index) => {
      let view = this.views.get(room.id);
      if (!view) {
        view = new RoomView(room, OfficeScene.selectRoom, this.startRename);
        this.views.set(room.id, view);
        this.world.addChild(view);
        this.labelLayer.addChild(view.nameLabel);
      } else {
        view.setRoom(room);
      }
      view.position.set(
        (index % columns) * (RoomView.roomWidth + OfficeScene.gapX),
        Math.floor(index / columns) * (RoomView.roomHeight + OfficeScene.gapY),
      );
      if (view.needsTick) this.animated.add(view);
      else this.animated.delete(view);
    });

    this.bounds = sorted.length > 0 ? OfficeScene.computeBounds(sorted.length, columns) : null;
    if (this.animated.size > 0) this.startTicking();
    else this.stopTicking();

    const key = sorted.map((room) => room.id).join('|');
    if (key !== this.layoutKey) {
      const hadLayout = this.layoutKey !== '';
      this.layoutKey = key;
      this.frame(hadLayout);
    }
    this.updateLabels();
    this.updateSubagentLabels();
  }

  private updateSubagentLabels(): void {
    const selectedId = useSessionsStore.getState().selectedRoomId;
    for (const view of this.views.values()) {
      view.setSubagentLabelsVisible(view.roomId === selectedId);
    }
  }

  private frame(animate: boolean): void {
    const selectedId = useSessionsStore.getState().selectedRoomId;
    const selected = selectedId ? this.views.get(selectedId) : undefined;
    this.camera.frame(
      selected
        ? { x: selected.x, y: selected.y, width: RoomView.roomWidth, height: RoomView.roomHeight }
        : this.bounds,
      animate,
    );
  }

  private readonly updateLabels = (): void => {
    const { x, y, scale } = this.world;
    for (const view of this.views.values()) {
      view.nameLabel.position.set(
        Math.round(x + (view.x + RoomView.roomWidth / 2) * scale.x),
        Math.round(y + view.y * scale.y) - OfficeScene.labelOffsetPx,
      );
    }
  };

  private readonly handleCameraChange = (): void => {
    this.updateLabels();
    const renaming = useSessionsStore.getState().renaming;
    if (renaming?.place === 'office' && renaming.rect) this.reportRenameRect(renaming.roomId);
  };

  private readonly startRename = (roomId: string, label: Text): void => {
    useSessionsStore.getState().startRename(roomId, 'office', OfficeScene.labelRect(label));
  };

  private reportRenameRect(roomId: string): void {
    const view = this.views.get(roomId);
    if (view) useSessionsStore.getState().moveRename(roomId, OfficeScene.labelRect(view.nameLabel));
  }

  private readonly tick = (ticker: Ticker): void => {
    for (const view of this.animated) {
      view.tick(ticker.deltaMS);
      if (!view.needsTick) this.animated.delete(view);
    }
    if (this.animated.size === 0) this.stopTicking();
  };

  private startTicking(): void {
    if (this.ticking) return;
    this.ticking = true;
    this.app.ticker.add(this.tick);
  }

  private stopTicking(): void {
    if (!this.ticking) return;
    this.ticking = false;
    this.app.ticker.remove(this.tick);
  }

  private static selectRoom(roomId: string): void {
    useSessionsStore.getState().select(roomId);
  }

  private static labelRect(label: Text): ScreenRect {
    const { x, y, width, height } = label.getBounds();
    return { x, y, width, height };
  }

  private static computeBounds(count: number, columns: number): WorldRect {
    const rows = Math.ceil(count / columns);
    return {
      x: 0,
      y: 0,
      width: columns * RoomView.roomWidth + (columns - 1) * OfficeScene.gapX,
      height: rows * RoomView.roomHeight + (rows - 1) * OfficeScene.gapY,
    };
  }
}
