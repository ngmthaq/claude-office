import { Container, Graphics, Rectangle, Text } from 'pixi.js';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';
import { AgentSprite } from './agent-sprite';

type SubagentEnd = 'done' | 'error' | 'stopped';
export type Point = { readonly x: number; readonly y: number };

type Phase = 'entering' | 'working' | 'marking' | 'leaving';

export class SubagentSprite extends Container {
  static readonly doorPosition: Point = { x: 88, y: 100 };
  static readonly hallwayPosition: Point = { x: 88, y: 130 };
  private static readonly walkPxPerSecond = 180;
  private static readonly markMs = 1500;
  private static readonly labelMaxChars = 9;
  private static readonly labelFontSize = 5;
  private static readonly labelResolutionBoost = 4;
  private static readonly markX = 4;
  private static readonly markY = -9;

  readonly subagentId: string;
  readonly spotIndex: number;
  private phase: Phase = 'entering';
  private phaseMs = 0;
  private legFrom: Point = SubagentSprite.hallwayPosition;
  private route: ReadonlyArray<Point>;
  private leg = 0;
  private readonly agent: AgentSprite;
  private readonly errorMark = SubagentSprite.drawErrorMark();
  private readonly typeLabel: Text;

  constructor(
    roomId: string,
    subagentId: string,
    agentType: string,
    spotIndex: number,
    spot: Point,
    private readonly onGone: (sprite: SubagentSprite) => void,
  ) {
    super();
    this.subagentId = subagentId;
    this.spotIndex = spotIndex;
    this.route = [SubagentSprite.doorPosition, spot];
    this.position.set(SubagentSprite.hallwayPosition.x, SubagentSprite.hallwayPosition.y);

    this.agent = new AgentSprite(agentType);
    this.errorMark.position.set(SubagentSprite.markX, SubagentSprite.markY);
    this.errorMark.visible = false;
    this.typeLabel = new Text({
      text: SubagentSprite.truncate(agentType),
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: SubagentSprite.labelFontSize,
        fill: 0xe4e6ea,
      },
      resolution: window.devicePixelRatio * SubagentSprite.labelResolutionBoost,
      roundPixels: true,
    });
    this.typeLabel.anchor.set(0.5, 1);
    this.typeLabel.position.set(AgentSprite.cellWidth / 2, SubagentSprite.markY);
    this.typeLabel.visible = false;
    this.addChild(this.agent, this.errorMark, this.typeLabel);

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.hitArea = new Rectangle(0, 0, AgentSprite.cellWidth, AgentSprite.cellHeight);
    this.on('pointertap', (event) => {
      event.stopPropagation();
      const sessions = useSessionsStore.getState();
      if (sessions.selectedRoomId !== roomId) sessions.select(roomId);
      useSubagentDetailsStore.getState().openDetails(roomId, subagentId);
    });
  }

  get needsTick(): boolean {
    return !this.destroyed;
  }

  get overlays(): Container[] {
    return [...this.agent.overlays, this.errorMark, this.typeLabel];
  }

  get isLeaving(): boolean {
    return this.phase === 'marking' || this.phase === 'leaving';
  }

  setLabelVisible(visible: boolean): void {
    this.typeLabel.visible = visible;
  }

  leave(status: SubagentEnd): void {
    if (this.isLeaving) return;
    if (status === 'error') {
      this.phase = 'marking';
      this.phaseMs = 0;
      this.agent.setState('idle');
      this.errorMark.visible = true;
      return;
    }
    this.startLeaving();
  }

  tick(deltaMs: number): void {
    this.phaseMs += deltaMs;
    switch (this.phase) {
      case 'entering':
        if (this.walk()) {
          this.phase = 'working';
          this.agent.setState('working');
        }
        break;
      case 'working':
        this.agent.tick(deltaMs);
        break;
      case 'marking':
        if (this.phaseMs >= SubagentSprite.markMs) this.startLeaving();
        break;
      case 'leaving':
        if (this.walk()) this.onGone(this);
        break;
    }
  }

  private startLeaving(): void {
    this.phase = 'leaving';
    this.phaseMs = 0;
    this.legFrom = { x: this.x, y: this.y };
    this.route = [SubagentSprite.doorPosition, SubagentSprite.hallwayPosition];
    this.leg = 0;
    this.errorMark.visible = false;
    this.agent.setState('idle');
  }

  private walk(): boolean {
    const target = this.route[this.leg];
    if (!target) return true;
    const distance = Math.hypot(target.x - this.legFrom.x, target.y - this.legFrom.y);
    const durationMs = (distance / SubagentSprite.walkPxPerSecond) * 1000;
    const progress = durationMs > 0 ? Math.min(1, this.phaseMs / durationMs) : 1;
    this.position.set(
      Math.round(this.legFrom.x + (target.x - this.legFrom.x) * progress),
      Math.round(this.legFrom.y + (target.y - this.legFrom.y) * progress),
    );
    if (progress < 1) return false;
    this.leg += 1;
    this.legFrom = target;
    this.phaseMs = 0;
    return this.leg >= this.route.length;
  }

  private static truncate(name: string): string {
    return name.length > SubagentSprite.labelMaxChars
      ? `${name.slice(0, SubagentSprite.labelMaxChars - 1)}…`
      : name;
  }

  private static drawErrorMark(): Graphics {
    const mark = new Graphics();
    mark.rect(0, 0, 12, 9).fill(0x1b1d21);
    mark.rect(1, 1, 10, 7).fill(0xe5484d);
    mark.rect(2, 9, 2, 2).fill(0x1b1d21);
    for (let step = 0; step < 5; step += 1) {
      mark.rect(3 + step, 2 + step, 1, 1).fill(0xffffff);
      mark.rect(7 - step, 2 + step, 1, 1).fill(0xffffff);
    }
    return mark;
  }
}
