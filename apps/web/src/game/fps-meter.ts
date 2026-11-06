import type { Application } from 'pixi.js';

const UPDATE_MS = 500;

export function startFpsMeter(app: Application, host: HTMLElement): () => void {
  const element = document.createElement('div');
  element.className = 'fps-meter';
  host.appendChild(element);

  const timer = setInterval(() => {
    element.textContent = `${Math.round(app.ticker.FPS)} FPS`;
  }, UPDATE_MS);

  return () => {
    clearInterval(timer);
    element.remove();
  };
}
