# Credits

All art here is the Pixel Office asset pack by 2dPig (https://2dpig.itch.io/pixel-office), released under CC0 1.0 (public domain). The license and readme are kept in `2dpig-pixel-office/`.

| Pack | URL | Author | License | Folder | Used for |
| --- | --- | --- | --- | --- | --- |
| Pixel Office | https://2dpig.itch.io/pixel-office | 2dPig | CC0 1.0 | `2dpig-pixel-office/` | Floor, back wall, windows, clock, plants, desks, computer, desk items and the people in rooms, plus the lobby hallways (floor, plants, sofas) |

## How the sheet is used

`PixelOfficeAssets.png` is not on a grid. The game cuts named frames from it with fixed `x, y, width, height` values. The table is in `apps/web/src/game/asset-loader.ts`.

- People are still frames. Walking is faked by sliding the sprite, and working by a 1px bob.
- Use nearest-neighbour scaling so the pixels stay sharp (PixiJS `scaleMode = 'nearest'`).
