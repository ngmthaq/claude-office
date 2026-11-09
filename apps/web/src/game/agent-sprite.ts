import { Container, Graphics, Sprite } from 'pixi.js';
import type { SessionState } from '@claude-office/shared';
import { getSprite, type SpriteName } from './asset-loader';

export class AgentSprite extends Container {
  static readonly cellWidth = 20;
  static readonly cellHeight = 24;
  private static readonly people = [
    'person0',
    'person1',
    'person2',
    'person3',
    'person4',
  ] as const satisfies ReadonlyArray<SpriteName>;
  private static readonly bobIntervalMs = 350;
  private static readonly dotsIntervalMs = 400;
  private static readonly blinkIntervalMs = 500;
  private static readonly bubbleX = 4;
  private static readonly bubbleY = -9;

  private state: SessionState = 'idle';
  private elapsedMs = 0;
  private readonly body: Container;
  private readonly workingBubble: Graphics;
  private readonly workingDots: Graphics[];
  private readonly waitingBubble: Graphics;

  constructor(seed: string) {
    super();
    const hash = AgentSprite.hashString(seed);
    const person = new Sprite(getSprite(AgentSprite.pick(AgentSprite.people, hash)));
    person.position.set(
      (AgentSprite.cellWidth - person.width) >> 1,
      AgentSprite.cellHeight - person.height,
    );

    this.body = new Container();
    this.body.addChild(person);
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

  get overlays(): Container[] {
    return [this.workingBubble, this.waitingBubble];
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

  private static pick(pool: ReadonlyArray<SpriteName>, seed: number): SpriteName {
    return pool[seed % pool.length] ?? 'person0';
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
