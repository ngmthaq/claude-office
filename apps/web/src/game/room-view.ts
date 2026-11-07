import { Container, Graphics, Rectangle, Sprite, Text } from 'pixi.js';
import { roomLabel, type RoomSummary, type SessionState } from '@claude-office/shared';
import { useChatStore } from '@/hooks/store/useChatStore';
import { AgentSprite } from './agent-sprite';
import { getTile, TILE_SIZE } from './asset-loader';
import { SubagentSprite, type Point } from './subagent-sprite';

export class RoomView extends Container {
  private static readonly roomCols = 9;
  private static readonly roomRows = 6;
  static readonly roomWidth = RoomView.roomCols * TILE_SIZE;
  static readonly roomHeight = RoomView.roomRows * TILE_SIZE;
  private static readonly floorTile = [24, 1] as const;
  private static readonly deskTiles: ReadonlyArray<readonly [number, number]> = [
    [4, 4],
    [5, 4],
    [6, 4],
  ];
  private static readonly smallDeskTile = [5, 4] as const;
  private static readonly smallDeskCols = [1, 3, 5, 7] as const;
  private static readonly smallDeskRow = 4;
  private static readonly doorColor = 0x2a1c12;
  private static readonly doorFrame = 0x9a7b5a;
  private static readonly badgeWidth = 14;
  private static readonly badgeHeight = 8;
  private static readonly badgeFontSize = 6;
  private static readonly badgeMax = 99;
  private static readonly plantTile = [16, 0] as const;
  private static readonly wallColor = 0x5a4636;
  private static readonly wallLight = 0x7a6350;
  private static readonly wallSide = 4;
  private static readonly wallTop = 10;
  private static readonly lampColors: Record<SessionState, number> = {
    idle: 0x6b7280,
    working: 0x3fb950,
    waiting: 0xf0c000,
    closed: 0x30343a,
  };
  private static readonly darkAlpha = 0.55;
  private static readonly labelMaxChars = 18;
  private static readonly labelFontSize = 12;
  private static readonly doubleTapMs = 300;
  /** Seats sit just above the small desks; standing spots are beside the side walls. */
  private static readonly subagentSpots: ReadonlyArray<Point> = [
    { x: 16, y: 48 },
    { x: 48, y: 48 },
    { x: 80, y: 48 },
    { x: 112, y: 48 },
    { x: 4, y: 34 },
    { x: 124, y: 34 },
    { x: 4, y: 70 },
    { x: 124, y: 70 },
  ];
  private static readonly overflowStepPx = 3;
  private static readonly overflowSlots = 7;
  private static readonly doorSpotY = SubagentSprite.doorPosition.y - 6;

  readonly roomId: string;
  readonly nameLabel: Text;
  readonly agent: AgentSprite;
  private readonly lamp = new Graphics();
  private readonly darkLayer = new Graphics();
  private readonly subagentLayer = new Container();
  private readonly subagents = new Map<string, SubagentSprite>();
  private readonly usedSpots = new Set<number>();
  private readonly badge = new Container();
  private readonly badgeText: Text;
  private labelsVisible = false;
  private state: SessionState | null = null;
  private pendingSelect: number | null = null;

  constructor(
    room: RoomSummary,
    onSelect: (roomId: string) => void,
    onRename: (roomId: string, label: Text) => void,
  ) {
    super();
    this.roomId = room.id;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.hitArea = new Rectangle(0, 0, RoomView.roomWidth, RoomView.roomHeight);
    this.on('pointertap', () => onSelect(room.id));

    this.addChild(RoomView.createFloor());
    this.agent = new AgentSprite(room.id);
    this.agent.position.set(4 * TILE_SIZE, 20);
    this.addChild(this.agent, this.subagentLayer);
    this.addChild(RoomView.createDesk(), RoomView.createSmallDesks());
    this.addChild(RoomView.createPlant(1, 1), RoomView.createPlant(7, 1));
    this.addChild(RoomView.createWalls(), this.lamp);
    this.badgeText = RoomView.createBadgeText();
    this.badge.addChild(RoomView.createBadgeBackground(), this.badgeText);
    this.badge.position.set(RoomView.roomWidth - RoomView.badgeWidth - 2, 1);
    this.badge.eventMode = 'none';
    this.badge.visible = false;
    this.addChild(this.badge);
    this.darkLayer
      .rect(0, 0, RoomView.roomWidth, RoomView.roomHeight)
      .fill({ color: 0x000000, alpha: RoomView.darkAlpha });
    this.darkLayer.eventMode = 'none';
    this.darkLayer.visible = false;
    this.addChild(this.darkLayer);

    this.nameLabel = new Text({
      text: RoomView.truncate(roomLabel(room)),
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: RoomView.labelFontSize,
        fill: 0xe4e6ea,
      },
      resolution: window.devicePixelRatio,
      roundPixels: true,
    });
    this.nameLabel.anchor.set(0.5, 1);
    this.nameLabel.eventMode = 'static';
    this.nameLabel.cursor = 'pointer';
    this.nameLabel.on('pointertap', (event) => {
      if (this.pendingSelect !== null || event.detail >= 2) {
        this.clearPendingSelect();
        onRename(room.id, this.nameLabel);
        return;
      }
      this.pendingSelect = window.setTimeout(() => {
        this.pendingSelect = null;
        onSelect(room.id);
      }, RoomView.doubleTapMs);
    });
    this.setRoom(room);
  }

  setRoom(room: RoomSummary): void {
    const text = RoomView.truncate(roomLabel(room));
    if (this.nameLabel.text !== text) this.nameLabel.text = text;
    this.syncSubagents(room);
    if (room.state === this.state) return;
    this.state = room.state;
    const closed = room.state === 'closed';
    this.darkLayer.visible = closed;
    this.agent.visible = !closed;
    this.agent.setState(room.state);
    this.lamp.clear().rect(6, 3, 6, 4).fill(RoomView.lampColors[room.state]);
  }

  get needsTick(): boolean {
    if (this.agent.needsTick) return true;
    for (const sprite of this.subagents.values()) if (sprite.needsTick) return true;
    return false;
  }

  tick(deltaMs: number): void {
    this.agent.tick(deltaMs);
    for (const sprite of this.subagents.values()) sprite.tick(deltaMs);
  }

  setSubagentLabelsVisible(visible: boolean): void {
    this.labelsVisible = visible;
    for (const sprite of this.subagents.values()) sprite.setLabelVisible(visible);
  }

  private syncSubagents(room: RoomSummary): void {
    const count = room.subagents.length;
    const badgeText = count > RoomView.badgeMax ? `${RoomView.badgeMax}+` : String(count);
    if (this.badgeText.text !== badgeText) this.badgeText.text = badgeText;
    this.badge.visible = count > 0;

    const activeIds = new Set<string>();
    for (const { id, agentType } of room.subagents) {
      activeIds.add(id);
      if (!this.subagents.has(id)) this.spawnSubagent(room.id, id, agentType);
    }
    for (const [id, sprite] of this.subagents) {
      if (activeIds.has(id) || sprite.isLeaving) continue;
      sprite.leave(RoomView.subagentEndStatus(room.id, id));
    }
  }

  private spawnSubagent(roomId: string, id: string, agentType: string): void {
    let spotIndex = 0;
    while (this.usedSpots.has(spotIndex)) spotIndex += 1;
    this.usedSpots.add(spotIndex);
    const sprite = new SubagentSprite(
      roomId,
      id,
      agentType,
      spotIndex,
      RoomView.subagentSpot(spotIndex),
      this.removeSubagent,
    );
    sprite.setLabelVisible(this.labelsVisible);
    this.subagents.set(id, sprite);
    this.subagentLayer.addChild(sprite);
  }

  private readonly removeSubagent = (sprite: SubagentSprite): void => {
    this.subagents.delete(sprite.subagentId);
    this.usedSpots.delete(sprite.spotIndex);
    sprite.destroy({ children: true });
  };

  private clearPendingSelect(): void {
    if (this.pendingSelect === null) return;
    window.clearTimeout(this.pendingSelect);
    this.pendingSelect = null;
  }

  override destroy(): void {
    this.clearPendingSelect();
    this.nameLabel.destroy();
    super.destroy({ children: true });
  }

  private static subagentSpot(index: number): Point {
    const fixed = RoomView.subagentSpots[index];
    if (fixed) return fixed;
    const slot = (index - RoomView.subagentSpots.length) % RoomView.overflowSlots;
    return {
      x: SubagentSprite.doorPosition.x + (slot - 3) * RoomView.overflowStepPx,
      y: RoomView.doorSpotY,
    };
  }

  // The server sends subagent_finished before the sessions update, so the item is already final.
  private static subagentEndStatus(roomId: string, subagentId: string): 'done' | 'error' {
    const items = useChatStore.getState().byRoom[roomId];
    const item = items?.find((entry) => entry.kind === 'subagent' && entry.id === subagentId);
    return item?.kind === 'subagent' && item.status === 'error' ? 'error' : 'done';
  }

  private static truncate(name: string): string {
    return name.length > RoomView.labelMaxChars
      ? `${name.slice(0, RoomView.labelMaxChars - 1)}…`
      : name;
  }

  private static createFloor(): Container {
    const floor = new Container();
    const texture = getTile('indoors', RoomView.floorTile[0], RoomView.floorTile[1]);
    for (let row = 0; row < RoomView.roomRows; row += 1) {
      for (let col = 0; col < RoomView.roomCols; col += 1) {
        const tile = new Sprite(texture);
        tile.position.set(col * TILE_SIZE, row * TILE_SIZE);
        floor.addChild(tile);
      }
    }
    return floor;
  }

  private static createDesk(): Container {
    const desk = new Container();
    RoomView.deskTiles.forEach(([col, row], index) => {
      const tile = new Sprite(getTile('indoors', col, row));
      tile.position.set((3 + index) * TILE_SIZE, 2 * TILE_SIZE);
      desk.addChild(tile);
    });
    return desk;
  }

  private static createSmallDesks(): Container {
    const desks = new Container();
    for (const col of RoomView.smallDeskCols) {
      const tile = new Sprite(
        getTile('indoors', RoomView.smallDeskTile[0], RoomView.smallDeskTile[1]),
      );
      tile.position.set(col * TILE_SIZE, RoomView.smallDeskRow * TILE_SIZE);
      desks.addChild(tile);
    }
    return desks;
  }

  private static createBadgeBackground(): Graphics {
    const background = new Graphics();
    background.rect(0, 0, RoomView.badgeWidth, RoomView.badgeHeight).fill(0x1b1d21);
    background.rect(1, 1, RoomView.badgeWidth - 2, RoomView.badgeHeight - 2).fill(0x4f8cff);
    return background;
  }

  private static createBadgeText(): Text {
    const text = new Text({
      text: '0',
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: RoomView.badgeFontSize,
        fill: 0xffffff,
      },
      resolution: window.devicePixelRatio * 4,
      roundPixels: true,
    });
    text.anchor.set(0.5);
    text.position.set(RoomView.badgeWidth / 2, RoomView.badgeHeight / 2);
    return text;
  }

  private static createPlant(col: number, row: number): Sprite {
    const plant = new Sprite(getTile('indoors', RoomView.plantTile[0], RoomView.plantTile[1]));
    plant.position.set(col * TILE_SIZE, row * TILE_SIZE);
    return plant;
  }

  private static createWalls(): Graphics {
    const walls = new Graphics();
    walls.rect(0, 0, RoomView.roomWidth, RoomView.wallTop).fill(RoomView.wallColor);
    walls.rect(0, RoomView.wallTop - 2, RoomView.roomWidth, 2).fill(RoomView.wallLight);
    walls.rect(0, 0, RoomView.wallSide, RoomView.roomHeight).fill(RoomView.wallColor);
    walls
      .rect(RoomView.roomWidth - RoomView.wallSide, 0, RoomView.wallSide, RoomView.roomHeight)
      .fill(RoomView.wallColor);
    const doorLeft = SubagentSprite.doorPosition.x;
    const doorRight = doorLeft + TILE_SIZE;
    const bottom = RoomView.roomHeight - RoomView.wallSide;
    walls.rect(0, bottom, doorLeft, RoomView.wallSide).fill(RoomView.wallColor);
    walls
      .rect(doorRight, bottom, RoomView.roomWidth - doorRight, RoomView.wallSide)
      .fill(RoomView.wallColor);
    walls.rect(doorLeft, bottom, TILE_SIZE, RoomView.wallSide).fill(RoomView.doorColor);
    walls.rect(doorLeft - 1, bottom, 1, RoomView.wallSide).fill(RoomView.doorFrame);
    walls.rect(doorRight, bottom, 1, RoomView.wallSide).fill(RoomView.doorFrame);
    return walls;
  }
}
