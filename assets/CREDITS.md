# Credits

All art here is by Kenney (https://kenney.nl). Both packs are CC0 1.0 (public domain). The license text is kept in each pack folder.

| Pack | URL | Author | License | Folder | Used for | Tile size | Walk frames |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Roguelike Indoors | https://kenney.nl/assets/roguelike-indoors | Kenney | CC0 1.0 | `kenney-roguelike-indoors/` | Furniture and decor for rooms (see "What is in the indoors sheet") | 16x16, 1px margin | n/a (no characters) |
| Roguelike Characters | https://kenney.nl/assets/roguelike-characters | Kenney | CC0 1.0 | `kenney-roguelike-characters/` | Root agent and sub-agent people, built from layers | 16x16, 1px margin | No. Every part is a single still frame. No walk cycle is shipped |

## What is in the indoors sheet

The pack is a home and medieval style set, not a modern office set. I viewed the sheet. It has:

- Tables (long, round, oval), chairs and stools in four facings, benches, and desks or counters.
- Beds in orange, green and cream colors, rugs and carpets in matching colors.
- Kitchen units: counters, stoves, sinks and cupboards.
- Small items: potted plants, candles and candelabras, torches, a ladder, paintings or maps, mirrors, banners, and a piano or organ.
- Large blocks of wood and carpet floor tiles (right-hand columns).

There are NO computers, monitors, keyboards or other office electronics in this pack. I did not find clear wall or door tiles either, so check this before S4 relies on them.

S4 can use the desks and tables as stand-ins for workstations. A CC0 office prop pack can be added later if needed.

## What is in the characters sheet

This is a layered "paper-doll" set, not a set of ready-made people. A character is built by drawing parts on top of each other in the same 16x16 cell. Column ranges below are 0-based and approximate (viewed on the sheet):

| Columns | Layer | Content |
| --- | --- | --- |
| 0-1 | Bodies | Bare bodies in 4 skin tones (rows 0-3). Below them (rows 5-11) are a few pre-dressed people, the only ready-made characters |
| 3-4 | Accessories | Small thin items (belts and similar) |
| 6-17 | Clothes / torsos | Shirts and armor in many colors, 12 columns by 11 rows |
| 19-26 | Hair | Hair styles in several colors |
| 28-32 | Hats / helmets | Hats and helmets |
| 33-41 | Shields | Round, square and heater shields |
| 42-53 | Weapons / tools | Swords, axes, staffs, maces and similar |

## Notes for S4

- Compose each person from layers: body first, then clothes, then hair, then an optional hat. Weapons and shields are optional and go on top. Draw all layers at the same position.
- Use different skin, clothes and hair combinations so each agent looks distinct.
- Both sheets use 16x16 tiles with a 1px gap. The step is 17px. Tile at column `c`, row `r` starts at x = `c * 17`, y = `r * 17`.
- Indoors sheet: `roguelikeIndoor_transparent.png`, 458x305 px (27 columns, 18 rows).
- Characters sheet: `roguelikeChar_transparent.png`, 918x203 px (54 columns, 12 rows).
- Parts are still frames. For walking, slide the sprite between points. A 1px up and down bob or an x flip can fake steps.
- Use nearest-neighbour scaling so the pixels stay sharp (PixiJS `scaleMode = 'nearest'`).
- Only the transparent sheets are kept. The magenta-background copies were left out.
