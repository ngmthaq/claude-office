import { Assets, Rectangle, Texture } from 'pixi.js';
import sheetUrl from '@assets/2dpig-pixel-office/PixelOfficeAssets.png';

const FRAMES = {
  floor: [3, 68, 73, 24],
  wall: [84, 70, 26, 20],
  windowA: [59, 96, 26, 21],
  windowB: [88, 96, 26, 21],
  clock: [159, 108, 19, 6],
  plant: [170, 65, 14, 19],
  sofaGrey: [119, 66, 33, 15],
  sofaBlue: [120, 83, 33, 16],
  sofaGreen: [120, 102, 33, 16],
  sofaOrange: [120, 121, 33, 16],
  mainDesk: [115, 47, 40, 16],
  smallDesk: [85, 47, 26, 16],
  computer: [233, 106, 15, 19],
  mug: [169, 95, 8, 7],
  deskItemA: [211, 119, 11, 8],
  deskItemB: [211, 129, 11, 8],
  deskItemC: [211, 140, 11, 8],
  person0: [2, 105, 15, 23],
  person1: [19, 104, 19, 24],
  person2: [40, 107, 13, 21],
  person3: [3, 132, 17, 23],
  person4: [22, 132, 17, 23],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type SpriteName = keyof typeof FRAMES;

let sheet: Texture | null = null;
const spriteCache = new Map<string, Texture>();

export async function loadSheets(): Promise<void> {
  if (sheet) return;
  sheet = await Assets.load<Texture>(sheetUrl);
}

/** Pass `cropWidth` or `cropHeight` to keep only the top-left part of the frame. */
export function getSprite(name: SpriteName, cropWidth?: number, cropHeight?: number): Texture {
  const [x, y, frameWidth, frameHeight] = FRAMES[name];
  const width = Math.min(frameWidth, cropWidth ?? frameWidth);
  const height = Math.min(frameHeight, cropHeight ?? frameHeight);
  const key = `${name}:${width}:${height}`;
  const cached = spriteCache.get(key);
  if (cached) return cached;
  if (!sheet) throw new Error('Sheet is not loaded. Call loadSheets() first.');

  const texture = new Texture({ source: sheet.source, frame: new Rectangle(x, y, width, height) });
  spriteCache.set(key, texture);
  return texture;
}
