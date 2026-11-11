import { Container, Graphics, Rectangle, RenderLayer, Sprite, Text } from 'pixi.js';
import { roomLabel, type RoomSummary, type SessionState } from '@claude-office/shared';
import { useChatStore } from '@/hooks/store/useChatStore';
import { AgentSprite } from './agent-sprite';
import { getSprite, type SpriteName } from './asset-loader';
import { SubagentSprite, type Point } from './subagent-sprite';

export class RoomView extends Container {
  private static readonly tileSize = 16;
  private static readonly roomCols = 12;
  private static readonly roomRows = 8;
  static readonly roomWidth = RoomView.roomCols * RoomView.tileSize;
  static readonly roomHeight = RoomView.roomRows * RoomView.tileSize;
  private static readonly floorStepX = 73;
  private static readonly floorStepY = 24;
  private static readonly wallStepX = 26;
  private static readonly decor: ReadonlyArray<readonly [SpriteName, number, number]> = [
    ['windowA', 28, 0],
    ['windowB', 138, 0],
    ['clock', 86, 6],
    ['plant', 14, 16],
    ['plant', 164, 16],
  ];
  private static readonly agentPosition: Point = { x: 72, y: 26 };
  private static readonly mainDeskPosition: Point = { x: 76, y: 48 };
  private static readonly computerPosition: Point = { x: 98, y: 34 };
  private static readonly mugPosition: Point = { x: 80, y: 51 };
  private static readonly smallDeskXs = [16, 60, 106, 150] as const;
  private static readonly smallDeskY = 96;
  private static readonly deskItems = [
    'deskItemA',
    'deskItemB',
    'deskItemC',
  ] as const satisfies ReadonlyArray<SpriteName>;
  private static readonly deskItemOffset: Point = { x: 7, y: 1 };
  private static readonly doorWidth = 16;
  private static readonly doorColor = 0x2a1c12;
  private static readonly doorFrame = 0x9a7b5a;
  private static readonly badgeWidth = 14;
  private static readonly badgeHeight = 8;
  private static readonly badgeFontSize = 6;
  private static readonly badgeMax = 99;
  private static readonly subagentBadgeColor = 0x4f8cff;
  private static readonly taskBadgeColor = 0xf0ad4e;
  private static readonly taskBadgeTextColor = 0x1b1d21;
  private static readonly wallColor = 0x5a4636;
  private static readonly wallSide = 4;
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
    { x: 19, y: 74 },
    { x: 63, y: 74 },
    { x: 109, y: 74 },
    { x: 153, y: 74 },
    { x: 6, y: 40 },
    { x: 36, y: 46 },
    { x: 136, y: 46 },
    { x: 166, y: 40 },
  ];
  private static readonly overflowStepPx = 3;
  private static readonly overflowSlots = 7;
  private static readonly doorSpotY = SubagentSprite.doorPosition.y - 6;

  readonly roomId: string;
  readonly nameLabel: Text;
  readonly agent: AgentSprite;
  private readonly lamp = new Graphics();
  private readonly darkLayer = RoomView.createDarkLayer();
  private readonly subagentLayer = new Container();
  private readonly overlayLayer = new RenderLayer();
  private readonly subagents = new Map<string, SubagentSprite>();
  private readonly usedSpots = new Set<number>();
  private readonly badge = new Container();
  private readonly badgeText: Text;
  private readonly taskBadge = new Container();
  private readonly taskBadgeText: Text;
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

    this.addChild(RoomView.createFloor(), RoomView.createBackWall(), RoomView.createDecor());
    this.agent = new AgentSprite(room.id);
    this.agent.position.set(RoomView.agentPosition.x, RoomView.agentPosition.y);
    this.addChild(this.agent, this.subagentLayer);
    this.addChild(RoomView.createDesk(), RoomView.createSmallDesks());
    this.addChild(RoomView.createWalls(), this.lamp);
    this.badgeText = RoomView.createBadgeText(0xffffff);
    this.badge.addChild(
      RoomView.createBadgeBackground(RoomView.subagentBadgeColor),
      this.badgeText,
    );
    this.badge.position.set(RoomView.roomWidth - RoomView.badgeWidth - 2, 1);
    this.badge.eventMode = 'none';
    this.badge.visible = false;
    this.addChild(this.badge);
    this.taskBadgeText = RoomView.createBadgeText(RoomView.taskBadgeTextColor);
    this.taskBadge.addChild(
      RoomView.createBadgeBackground(RoomView.taskBadgeColor),
      this.taskBadgeText,
    );
    this.taskBadge.position.set(RoomView.roomWidth - RoomView.badgeWidth * 2 - 4, 1);
    this.taskBadge.eventMode = 'none';
    this.taskBadge.visible = false;
    this.addChild(this.taskBadge);
    this.overlayLayer.eventMode = 'none';
    this.addChild(this.overlayLayer);
    this.overlayLayer.attach(...this.agent.overlays);
    this.darkLayer.visible = false;
    this.addChild(this.darkLayer);

    this.nameLabel = new Text({
      text: RoomView.truncate(roomLabel(room)),
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: RoomView.labelFontSize,
        fill: 0xe4e6ea,
        stroke: { color: 0x1b1d21, width: 3 },
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
    this.syncBackgroundTasks(room);
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

  private syncBackgroundTasks(room: RoomSummary): void {
    const count = room.backgroundTasks.length;
    const text = RoomView.formatBadgeCount(count);
    if (this.taskBadgeText.text !== text) this.taskBadgeText.text = text;
    this.taskBadge.visible = count > 0;
  }

  private syncSubagents(room: RoomSummary): void {
    const count = room.subagents.length;
    const badgeText = RoomView.formatBadgeCount(count);
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
    this.overlayLayer.attach(...sprite.overlays);
  }

  private readonly removeSubagent = (sprite: SubagentSprite): void => {
    this.subagents.delete(sprite.subagentId);
    this.usedSpots.delete(sprite.spotIndex);
    this.overlayLayer.detach(...sprite.overlays);
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

  private static place(
    name: SpriteName,
    x: number,
    y: number,
    cropWidth?: number,
    cropHeight?: number,
  ): Sprite {
    const sprite = new Sprite(getSprite(name, cropWidth, cropHeight));
    sprite.position.set(x, y);
    return sprite;
  }

  /** An unfurnished, dimmed room used to fill empty lobby slots. */
  static createVacantRoom(): Container {
    const room = new Container();
    room.eventMode = 'none';
    room.addChild(
      RoomView.createFloor(),
      RoomView.createBackWall(),
      RoomView.createWalls(),
      RoomView.createDarkLayer(),
    );
    return room;
  }

  private static createDarkLayer(): Graphics {
    const layer = new Graphics();
    layer
      .rect(0, 0, RoomView.roomWidth, RoomView.roomHeight)
      .fill({ color: 0x000000, alpha: RoomView.darkAlpha });
    layer.eventMode = 'none';
    return layer;
  }

  private static createFloor(): Container {
    const floor = new Container();
    for (let y = 0; y < RoomView.roomHeight; y += RoomView.floorStepY) {
      for (let x = 0; x < RoomView.roomWidth; x += RoomView.floorStepX) {
        floor.addChild(
          RoomView.place('floor', x, y, RoomView.roomWidth - x, RoomView.roomHeight - y),
        );
      }
    }
    return floor;
  }

  private static createBackWall(): Container {
    const wall = new Container();
    for (let x = 0; x < RoomView.roomWidth; x += RoomView.wallStepX) {
      wall.addChild(RoomView.place('wall', x, 0, RoomView.roomWidth - x));
    }
    return wall;
  }

  private static createDecor(): Container {
    const decor = new Container();
    for (const [name, x, y] of RoomView.decor) decor.addChild(RoomView.place(name, x, y));
    return decor;
  }

  private static createDesk(): Container {
    const desk = new Container();
    const { mainDeskPosition, computerPosition, mugPosition } = RoomView;
    desk.addChild(
      RoomView.place('mainDesk', mainDeskPosition.x, mainDeskPosition.y),
      RoomView.place('computer', computerPosition.x, computerPosition.y),
      RoomView.place('mug', mugPosition.x, mugPosition.y),
    );
    return desk;
  }

  private static createSmallDesks(): Container {
    const desks = new Container();
    RoomView.smallDeskXs.forEach((x, index) => {
      const item = RoomView.deskItems[index % RoomView.deskItems.length] ?? 'deskItemA';
      desks.addChild(
        RoomView.place('smallDesk', x, RoomView.smallDeskY),
        RoomView.place(
          item,
          x + RoomView.deskItemOffset.x,
          RoomView.smallDeskY + RoomView.deskItemOffset.y,
        ),
      );
    });
    return desks;
  }

  private static formatBadgeCount(count: number): string {
    return count > RoomView.badgeMax ? `${RoomView.badgeMax}+` : String(count);
  }

  private static createBadgeBackground(fill: number): Graphics {
    const background = new Graphics();
    background.rect(0, 0, RoomView.badgeWidth, RoomView.badgeHeight).fill(0x1b1d21);
    background.rect(1, 1, RoomView.badgeWidth - 2, RoomView.badgeHeight - 2).fill(fill);
    return background;
  }

  private static createBadgeText(color: number): Text {
    const text = new Text({
      text: '0',
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: RoomView.badgeFontSize,
        fill: color,
      },
      resolution: window.devicePixelRatio * 4,
      roundPixels: true,
    });
    text.anchor.set(0.5);
    text.position.set(RoomView.badgeWidth / 2, RoomView.badgeHeight / 2);
    return text;
  }

  private static createWalls(): Graphics {
    const walls = new Graphics();
    walls.rect(0, 0, RoomView.wallSide, RoomView.roomHeight).fill(RoomView.wallColor);
    walls
      .rect(RoomView.roomWidth - RoomView.wallSide, 0, RoomView.wallSide, RoomView.roomHeight)
      .fill(RoomView.wallColor);
    const doorLeft = SubagentSprite.doorPosition.x;
    const doorRight = doorLeft + RoomView.doorWidth;
    const bottom = RoomView.roomHeight - RoomView.wallSide;
    walls.rect(0, bottom, doorLeft, RoomView.wallSide).fill(RoomView.wallColor);
    walls
      .rect(doorRight, bottom, RoomView.roomWidth - doorRight, RoomView.wallSide)
      .fill(RoomView.wallColor);
    walls.rect(doorLeft, bottom, RoomView.doorWidth, RoomView.wallSide).fill(RoomView.doorColor);
    walls.rect(doorLeft - 1, bottom, 1, RoomView.wallSide).fill(RoomView.doorFrame);
    walls.rect(doorRight, bottom, 1, RoomView.wallSide).fill(RoomView.doorFrame);
    return walls;
  }
}
