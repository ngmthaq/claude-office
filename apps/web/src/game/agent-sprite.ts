import { Container, Graphics, Sprite } from 'pixi.js';
import type { SessionState } from '@claude-office/shared';
import { getTile } from './asset-loader';

export class AgentSprite extends Container {
  private static readonly clothesPool: ReadonlyArray<readonly [number, number]> = [
    [6, 0],
    [7, 0],
    [10, 0],
    [11, 0],
    [12, 0],
    [13, 0],
    [6, 5],
    [7, 5],
    [10, 5],
    [11, 5],
    [12, 5],
    [13, 5],
  ];
  private static readonly hairPool: ReadonlyArray<readonly [number, number]> = [
    [19, 0],
    [20, 0],
    [21, 0],
    [23, 0],
    [24, 0],
    [19, 4],
    [20, 4],
    [21, 4],
    [23, 4],
    [24, 4],
  ];
  private static readonly skinRows = 4;
  private static readonly bobIntervalMs = 350;
  private static readonly dotsIntervalMs = 400;
  private static readonly blinkIntervalMs = 500;
  private static readonly bubbleX = 8;
  private static readonly bubbleY = -12;

  private state: SessionState = 'idle';
  private elapsedMs = 0;
  private readonly body: Container;
  private readonly workingBubble: Graphics;
  private readonly workingDots: Graphics[];
  private readonly waitingBubble: Graphics;

  constructor(seed: string) {
    super();
    const hash = AgentSprite.hashString(seed);
    const clothes = AgentSprite.pick(AgentSprite.clothesPool, hash >>> 3);
    const hair = AgentSprite.pick(AgentSprite.hairPool, hash >>> 9);

    this.body = new Container();
    this.body.addChild(
      new Sprite(getTile('characters', 0, hash % AgentSprite.skinRows)),
      new Sprite(getTile('characters', clothes[0], clothes[1])),
      new Sprite(getTile('characters', hair[0], hair[1])),
    );
    this.addChild(this.body);

    this.workingDots = [0, 1, 2].map((index) => AgentSprite.drawDot(index));
    this.workingBubble = AgentSprite.drawBubble(0xffffff);
    this.workingBubble.addChild(...this.workingDots);
    this.waitingBubble = AgentSprite.drawBubble(0xffd23f);
    this.waitingBubble.addChild(AgentSprite.drawExclamation());
    for (const bubble of [this.workingBubble, this.waitingBubble]) {
      bubble.position.set(AgentSprite.bubbleX, AgentSprite.bubbleY);
      bubble.visible = false;
      this.addChild(bubble);
    }
  }

  get needsTick(): boolean {
    return this.state === 'working' || this.state === 'waiting';
  }

  setState(state: SessionState): void {
    if (state === this.state) return;
    this.state = state;
    this.elapsedMs = 0;
    this.refresh();
  }

  tick(deltaMs: number): void {
    if (!this.needsTick) return;
    this.elapsedMs += deltaMs;
    this.refresh();
  }

  private refresh(): void {
    const { state, elapsedMs } = this;
    this.workingBubble.visible = state === 'working';
    this.waitingBubble.visible =
      state === 'waiting' && Math.floor(elapsedMs / AgentSprite.blinkIntervalMs) % 2 === 0;
    this.body.y =
      state === 'working' && Math.floor(elapsedMs / AgentSprite.bobIntervalMs) % 2 === 1 ? -1 : 0;
    if (state === 'working') {
      const shown = (Math.floor(elapsedMs / AgentSprite.dotsIntervalMs) % 3) + 1;
      this.workingDots.forEach((dot, index) => (dot.visible = index < shown));
    }
  }

  private static pick(pool: ReadonlyArray<TilePos>, seed: number): TilePos {
    return pool[seed % pool.length] ?? [0, 0];
  }

  private static hashString(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
    }
    return hash >>> 0;
  }

  private static drawBubble(color: number): Graphics {
    const bubble = new Graphics();
    bubble.rect(0, 0, 12, 9).fill(0x1b1d21);
    bubble.rect(1, 1, 10, 7).fill(color);
    bubble.rect(2, 9, 2, 2).fill(0x1b1d21);
    return bubble;
  }

  private static drawDot(index: number): Graphics {
    return new Graphics().rect(2 + index * 3, 4, 2, 2).fill(0x1b1d21);
  }

  private static drawExclamation(): Graphics {
    const mark = new Graphics();
    mark.rect(5, 2, 2, 3).fill(0x1b1d21);
    mark.rect(5, 6, 2, 1).fill(0x1b1d21);
    return mark;
  }
}

type TilePos = readonly [number, number];
