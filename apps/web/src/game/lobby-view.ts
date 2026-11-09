import { Container, Graphics, Sprite } from 'pixi.js';
import { getSprite, type SpriteName } from './asset-loader';
import { RoomView } from './room-view';

export class LobbyView extends Container {
  static readonly gapX = 16;
  static readonly hallwayHeight = 44;
  static readonly columnStep = RoomView.roomWidth + LobbyView.gapX;
  static readonly rowStep = RoomView.roomHeight + LobbyView.hallwayHeight;
  private static readonly floorTint = 0x9aa5b8;
  private static readonly floorStepX = 73;
  private static readonly floorStepY = 24;
  private static readonly wallColor = 0x5a4636;
  private static readonly wallThickness = 4;
  private static readonly decorOffsetY = 2;
  private static readonly sofaOffsetX = 16;
  private static readonly plantOffsetX = 150;
  private static readonly sofas = [
    'sofaGrey',
    'sofaBlue',
    'sofaGreen',
    'sofaOrange',
  ] as const satisfies ReadonlyArray<SpriteName>;

  private columns = 0;
  private rows = 0;
  private roomCount = 0;

  setLayout(columns: number, rows: number, roomCount: number): void {
    if (columns === this.columns && rows === this.rows && roomCount === this.roomCount) return;
    this.columns = columns;
    this.rows = rows;
    this.roomCount = roomCount;
    for (const child of this.removeChildren()) child.destroy({ children: true });
    if (columns <= 0 || rows <= 0) return;

    const floor = new Container();
    const decor = new Container();
    const width = columns * LobbyView.columnStep - LobbyView.gapX;
    for (let row = 0; row < rows; row += 1) {
      const rowY = row * LobbyView.rowStep;
      const hallwayY = rowY + RoomView.roomHeight;
      LobbyView.fillFloor(floor, 0, hallwayY, width, LobbyView.hallwayHeight);
      for (let column = 0; column < columns - 1; column += 1) {
        if (!this.hasRoom(row, column)) continue;
        const gapLeft = column * LobbyView.columnStep + RoomView.roomWidth;
        LobbyView.fillFloor(floor, gapLeft, rowY, LobbyView.gapX, RoomView.roomHeight);
      }
      for (let column = 0; column < columns; column += 1) {
        const x = column * LobbyView.columnStep;
        const y = hallwayY + LobbyView.decorOffsetY;
        const sofa = LobbyView.sofas[column % LobbyView.sofas.length] ?? 'sofaGrey';
        decor.addChild(
          LobbyView.place(sofa, x + LobbyView.sofaOffsetX, y),
          LobbyView.place('plant', x + LobbyView.plantOffsetX, y),
        );
      }
    }
    this.addChild(floor, this.createWalls(columns, rows, width), decor);
  }

  private hasRoom(row: number, column: number): boolean {
    return row * this.columns + column < this.roomCount;
  }

  private createWalls(columns: number, rows: number, width: number): Graphics {
    const walls = new Graphics();
    const thick = LobbyView.wallThickness;
    const height = rows * LobbyView.rowStep;
    const fill = (x: number, y: number, w: number, h: number): void => {
      walls.rect(x, y, w, h).fill(LobbyView.wallColor);
    };

    for (let row = 0; row < rows; row += 1) {
      const rowY = row * LobbyView.rowStep;
      const hallwayY = rowY + RoomView.roomHeight;
      const lineY = hallwayY - thick;
      for (let column = 0; column < columns; column += 1) {
        const x = column * LobbyView.columnStep;
        if (!this.hasRoom(row, column)) {
          fill(x, lineY, RoomView.roomWidth, thick);
          continue;
        }
        if (column >= columns - 1) continue;
        const gapLeft = x + RoomView.roomWidth;
        if (!this.hasRoom(row, column + 1)) {
          fill(gapLeft + LobbyView.gapX - thick, rowY, thick, RoomView.roomHeight);
        }
        if (row === 0) fill(gapLeft, 0, LobbyView.gapX, thick);
      }
      fill(0, hallwayY, thick, LobbyView.hallwayHeight);
      fill(width - thick, hallwayY, thick, LobbyView.hallwayHeight);
    }
    fill(0, height - thick, width, thick);
    return walls;
  }

  private static fillFloor(
    floor: Container,
    left: number,
    top: number,
    width: number,
    height: number,
  ): void {
    for (let y = 0; y < height; y += LobbyView.floorStepY) {
      for (let x = 0; x < width; x += LobbyView.floorStepX) {
        const tile = LobbyView.place('floor', left + x, top + y, width - x, height - y);
        tile.tint = LobbyView.floorTint;
        floor.addChild(tile);
      }
    }
  }

  private static place(
    name: SpriteName,
    x: number,
    y: number,
    cropWidth?: number,
    cropHeight?: number,
  ): Sprite {
    const sprite = new Sprite(getSprite(name, cropWidth, cropHeight));
    sprite.position.set(x, y);
    return sprite;
  }
}
