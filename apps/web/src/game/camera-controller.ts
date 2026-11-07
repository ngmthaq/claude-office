import type { Application, Container, Ticker } from 'pixi.js';

export type WorldRect = { x: number; y: number; width: number; height: number };

type View = { x: number; y: number; scale: number };

export class CameraController {
  private static readonly tweenMs = 300;
  private static readonly padSide = 16;
  private static readonly padTop = 28;
  private static readonly padBottom = 16;

  private target: WorldRect | null = null;
  private readonly from: View = { x: 0, y: 0, scale: 1 };
  private readonly to: View = { x: 0, y: 0, scale: 1 };
  private elapsedMs = 0;
  private tweening = false;

  constructor(
    private readonly app: Application,
    private readonly world: Container,
    private readonly onChange: () => void,
  ) {
    app.renderer.on('resize', this.handleResize);
  }

  frame(target: WorldRect | null, animate: boolean): void {
    this.target = target;
    if (!target) return;
    this.computeView(target, this.to);
    if (animate) this.startTween();
    else this.snap();
  }

  destroy(): void {
    this.app.renderer.off('resize', this.handleResize);
    this.stopTween();
  }

  private readonly handleResize = (): void => {
    if (!this.target) return;
    this.computeView(this.target, this.to);
    if (!this.tweening) this.snap();
  };

  private readonly tick = (ticker: Ticker): void => {
    this.elapsedMs += ticker.deltaMS;
    const t = Math.min(1, this.elapsedMs / CameraController.tweenMs);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const { from, to } = this;
    this.apply(
      from.x + (to.x - from.x) * eased,
      from.y + (to.y - from.y) * eased,
      from.scale + (to.scale - from.scale) * eased,
    );
    if (t >= 1) {
      this.stopTween();
      this.snap();
    }
  };

  private startTween(): void {
    const { world, from } = this;
    from.x = world.x;
    from.y = world.y;
    from.scale = world.scale.x;
    this.elapsedMs = 0;
    if (this.tweening) return;
    this.tweening = true;
    this.app.ticker.add(this.tick);
  }

  private stopTween(): void {
    if (!this.tweening) return;
    this.tweening = false;
    this.app.ticker.remove(this.tick);
  }

  private snap(): void {
    this.apply(this.to.x, this.to.y, this.to.scale);
  }

  private apply(x: number, y: number, scale: number): void {
    this.world.scale.set(scale);
    this.world.position.set(x, y);
    this.onChange();
  }

  private computeView(rect: WorldRect, out: View): void {
    const { width, height } = this.app.screen;
    const fullWidth = rect.width + CameraController.padSide * 2;
    const fullHeight = rect.height + CameraController.padTop + CameraController.padBottom;
    const fit = Math.max(Math.min(width / fullWidth, height / fullHeight), 0.05);
    const scale = fit >= 1 ? Math.floor(fit) : fit;
    out.scale = scale;
    out.x = Math.round((width - rect.width * scale) / 2 - rect.x * scale);
    out.y = Math.round(
      (height - fullHeight * scale) / 2 - (rect.y - CameraController.padTop) * scale,
    );
  }
}
