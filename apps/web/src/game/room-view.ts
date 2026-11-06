import { Container, Graphics, Rectangle, Sprite, Text } from 'pixi.js';
import { roomLabel, type RoomSummary, type SessionState } from '@claude-office/shared';
import { useChatStore } from '@/hooks/store/useChatStore';
import { AgentSprite } from './agent-sprite';
import { getTile, TILE_SIZE } from './asset-loader';
import { DOOR_POSITION, SubagentSprite, type Point } from './subagent-sprite';

export const ROOM_COLS = 9;
export const ROOM_ROWS = 6;
export const ROOM_WIDTH = ROOM_COLS * TILE_SIZE;
export const ROOM_HEIGHT = ROOM_ROWS * TILE_SIZE;

const FLOOR_TILE = [24, 1] as const;
const DESK_TILES: ReadonlyArray<readonly [number, number]> = [
  [4, 4],
  [5, 4],
  [6, 4],
];
const SMALL_DESK_TILE = [5, 4] as const;
const SMALL_DESK_COLS = [1, 3, 5, 7] as const;
const SMALL_DESK_ROW = 4;
const DOOR_COLOR = 0x2a1c12;
const DOOR_FRAME = 0x9a7b5a;
const BADGE_WIDTH = 14;
const BADGE_HEIGHT = 8;
const BADGE_FONT_SIZE = 6;
const BADGE_MAX = 99;
const PLANT_TILE = [16, 0] as const;
const WALL_COLOR = 0x5a4636;
const WALL_LIGHT = 0x7a6350;
const WALL_SIDE = 4;
const WALL_TOP = 10;
const LAMP_COLORS: Record<SessionState, number> = {
  idle: 0x6b7280,
  working: 0x3fb950,
  waiting: 0xf0c000,
  closed: 0x30343a,
};
const DARK_ALPHA = 0.55;
const LABEL_MAX_CHARS = 18;
const LABEL_FONT_SIZE = 12;
const DOUBLE_TAP_MS = 300;

/** Seats sit just above the small desks; standing spots are beside the side walls. */
export const SUBAGENT_SPOTS: ReadonlyArray<Point> = [
  { x: 16, y: 48 },
  { x: 48, y: 48 },
  { x: 80, y: 48 },
  { x: 112, y: 48 },
  { x: 4, y: 34 },
  { x: 124, y: 34 },
  { x: 4, y: 70 },
  { x: 124, y: 70 },
];
const OVERFLOW_STEP_PX = 3;
const OVERFLOW_SLOTS = 7;
const DOOR_SPOT_Y = DOOR_POSITION.y - 6;

export function subagentSpot(index: number): Point {
  const fixed = SUBAGENT_SPOTS[index];
  if (fixed) return fixed;
  const slot = (index - SUBAGENT_SPOTS.length) % OVERFLOW_SLOTS;
  return { x: DOOR_POSITION.x + (slot - 3) * OVERFLOW_STEP_PX, y: DOOR_SPOT_Y };
}

// The server sends subagent_finished before the sessions update, so the item is already final.
function subagentEndStatus(roomId: string, subagentId: string): 'done' | 'error' {
  const items = useChatStore.getState().byRoom[roomId];
  const item = items?.find((entry) => entry.kind === 'subagent' && entry.id === subagentId);
  return item?.kind === 'subagent' && item.status === 'error' ? 'error' : 'done';
}

export class RoomView extends Container {
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
    this.hitArea = new Rectangle(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    this.on('pointertap', () => onSelect(room.id));

    this.addChild(createFloor());
    this.agent = new AgentSprite(room.id);
    this.agent.position.set(4 * TILE_SIZE, 20);
    this.addChild(this.agent, this.subagentLayer);
    this.addChild(createDesk(), createSmallDesks());
    this.addChild(createPlant(1, 1), createPlant(7, 1));
    this.addChild(createWalls(), this.lamp);
    this.badgeText = createBadgeText();
    this.badge.addChild(createBadgeBackground(), this.badgeText);
    this.badge.position.set(ROOM_WIDTH - BADGE_WIDTH - 2, 1);
    this.badge.eventMode = 'none';
    this.badge.visible = false;
    this.addChild(this.badge);
    this.darkLayer.rect(0, 0, ROOM_WIDTH, ROOM_HEIGHT).fill({ color: 0x000000, alpha: DARK_ALPHA });
    this.darkLayer.eventMode = 'none';
    this.darkLayer.visible = false;
    this.addChild(this.darkLayer);

    this.nameLabel = new Text({
      text: truncate(roomLabel(room)),
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: LABEL_FONT_SIZE,
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
      }, DOUBLE_TAP_MS);
    });
    this.setRoom(room);
  }

  setRoom(room: RoomSummary): void {
    const text = truncate(roomLabel(room));
    if (this.nameLabel.text !== text) this.nameLabel.text = text;
    this.syncSubagents(room);
    if (room.state === this.state) return;
    this.state = room.state;
    const closed = room.state === 'closed';
    this.darkLayer.visible = closed;
    this.agent.visible = !closed;
    this.agent.setState(room.state);
    this.lamp.clear().rect(6, 3, 6, 4).fill(LAMP_COLORS[room.state]);
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
    const badgeText = count > BADGE_MAX ? `${BADGE_MAX}+` : String(count);
    if (this.badgeText.text !== badgeText) this.badgeText.text = badgeText;
    this.badge.visible = count > 0;

    const activeIds = new Set<string>();
    for (const { id, agentType } of room.subagents) {
      activeIds.add(id);
      if (!this.subagents.has(id)) this.spawnSubagent(room.id, id, agentType);
    }
    for (const [id, sprite] of this.subagents) {
      if (activeIds.has(id) || sprite.isLeaving) continue;
      sprite.leave(subagentEndStatus(room.id, id));
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
      subagentSpot(spotIndex),
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
}

function truncate(name: string): string {
  return name.length > LABEL_MAX_CHARS ? `${name.slice(0, LABEL_MAX_CHARS - 1)}…` : name;
}

function createFloor(): Container {
  const floor = new Container();
  const texture = getTile('indoors', FLOOR_TILE[0], FLOOR_TILE[1]);
  for (let row = 0; row < ROOM_ROWS; row += 1) {
    for (let col = 0; col < ROOM_COLS; col += 1) {
      const tile = new Sprite(texture);
      tile.position.set(col * TILE_SIZE, row * TILE_SIZE);
      floor.addChild(tile);
    }
  }
  return floor;
}

function createDesk(): Container {
  const desk = new Container();
  DESK_TILES.forEach(([col, row], index) => {
    const tile = new Sprite(getTile('indoors', col, row));
    tile.position.set((3 + index) * TILE_SIZE, 2 * TILE_SIZE);
    desk.addChild(tile);
  });
  return desk;
}

function createSmallDesks(): Container {
  const desks = new Container();
  for (const col of SMALL_DESK_COLS) {
    const tile = new Sprite(getTile('indoors', SMALL_DESK_TILE[0], SMALL_DESK_TILE[1]));
    tile.position.set(col * TILE_SIZE, SMALL_DESK_ROW * TILE_SIZE);
    desks.addChild(tile);
  }
  return desks;
}

function createBadgeBackground(): Graphics {
  const background = new Graphics();
  background.rect(0, 0, BADGE_WIDTH, BADGE_HEIGHT).fill(0x1b1d21);
  background.rect(1, 1, BADGE_WIDTH - 2, BADGE_HEIGHT - 2).fill(0x4f8cff);
  return background;
}

function createBadgeText(): Text {
  const text = new Text({
    text: '0',
    style: { fontFamily: 'system-ui, sans-serif', fontSize: BADGE_FONT_SIZE, fill: 0xffffff },
    resolution: window.devicePixelRatio * 4,
    roundPixels: true,
  });
  text.anchor.set(0.5);
  text.position.set(BADGE_WIDTH / 2, BADGE_HEIGHT / 2);
  return text;
}

function createPlant(col: number, row: number): Sprite {
  const plant = new Sprite(getTile('indoors', PLANT_TILE[0], PLANT_TILE[1]));
  plant.position.set(col * TILE_SIZE, row * TILE_SIZE);
  return plant;
}

function createWalls(): Graphics {
  const walls = new Graphics();
  walls.rect(0, 0, ROOM_WIDTH, WALL_TOP).fill(WALL_COLOR);
  walls.rect(0, WALL_TOP - 2, ROOM_WIDTH, 2).fill(WALL_LIGHT);
  walls.rect(0, 0, WALL_SIDE, ROOM_HEIGHT).fill(WALL_COLOR);
  walls.rect(ROOM_WIDTH - WALL_SIDE, 0, WALL_SIDE, ROOM_HEIGHT).fill(WALL_COLOR);
  const doorLeft = DOOR_POSITION.x;
  const doorRight = doorLeft + TILE_SIZE;
  const bottom = ROOM_HEIGHT - WALL_SIDE;
  walls.rect(0, bottom, doorLeft, WALL_SIDE).fill(WALL_COLOR);
  walls.rect(doorRight, bottom, ROOM_WIDTH - doorRight, WALL_SIDE).fill(WALL_COLOR);
  walls.rect(doorLeft, bottom, TILE_SIZE, WALL_SIDE).fill(DOOR_COLOR);
  walls.rect(doorLeft - 1, bottom, 1, WALL_SIDE).fill(DOOR_FRAME);
  walls.rect(doorRight, bottom, 1, WALL_SIDE).fill(DOOR_FRAME);
  return walls;
}
