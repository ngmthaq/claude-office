import { Application, TextureStyle } from 'pixi.js';

const BACKGROUND_COLOR = 0x1b1d21;

export async function createPixiApp(host: HTMLElement): Promise<Application> {
  TextureStyle.defaultOptions.scaleMode = 'nearest';

  const app = new Application();
  await app.init({
    resizeTo: host,
    antialias: false,
    roundPixels: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    background: BACKGROUND_COLOR,
  });
  return app;
}
