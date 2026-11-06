import { Assets, Rectangle, Texture } from 'pixi.js';
import charactersSheetUrl from '@assets/kenney-roguelike-characters/roguelikeChar_transparent.png';
import indoorSheetUrl from '@assets/kenney-roguelike-indoors/roguelikeIndoor_transparent.png';

export type SheetName = 'indoors' | 'characters';

export const TILE_SIZE = 16;
const TILE_STEP = 17;

const SHEET_URLS: Record<SheetName, string> = {
  indoors: indoorSheetUrl,
  characters: charactersSheetUrl,
};

const sheetTextures = new Map<SheetName, Texture>();
const tileCache = new Map<string, Texture>();

export async function loadSheets(): Promise<void> {
  const names = Object.keys(SHEET_URLS) as SheetName[];
  await Promise.all(
    names.map(async (name) => {
      if (sheetTextures.has(name)) return;
      sheetTextures.set(name, await Assets.load<Texture>(SHEET_URLS[name]));
    }),
  );
}

export function getTile(sheet: SheetName, col: number, row: number): Texture {
  const key = `${sheet}:${col}:${row}`;
  const cached = tileCache.get(key);
  if (cached) return cached;

  const source = sheetTextures.get(sheet);
  if (!source) throw new Error(`Sheet "${sheet}" is not loaded. Call loadSheets() first.`);

  const frame = new Rectangle(col * TILE_STEP, row * TILE_STEP, TILE_SIZE, TILE_SIZE);
  const tile = new Texture({ source: source.source, frame });
  tileCache.set(key, tile);
  return tile;
}
