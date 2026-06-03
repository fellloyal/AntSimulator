import { toInt } from '@/common/math';

export class Grid<T> {
  cells: T[];
  width: number;
  height: number;
  cellSize: number;

  constructor(width: number, height: number, cellSize: number, createCell: () => T) {
    this.width = toInt(width / cellSize);
    this.height = toInt(height / cellSize);
    this.cellSize = cellSize;
    this.cells = [];
    const count = this.width * this.height;
    for (let i = 0; i < count; i++) {
      this.cells.push(createCell());
    }
  }

  getCellCoords(pos: { x: number; y: number }): { x: number; y: number } {
    return {
      x: toInt(pos.x / this.cellSize),
      y: toInt(pos.y / this.cellSize),
    };
  }

  checkCoords(coords: { x: number; y: number }): boolean {
    return coords.x > -1 && coords.x < this.width && coords.y > -1 && coords.y < this.height;
  }

  get(pos: { x: number; y: number }): T {
    const coords = this.getCellCoords(pos);
    return this.cells[coords.x + coords.y * this.width];
  }

  getByCoords(coords: { x: number; y: number }): T {
    return this.cells[coords.x + coords.y * this.width];
  }

  getSafe(pos: { x: number; y: number }): T | null {
    const coords = this.getCellCoords(pos);
    if (this.checkCoords(coords)) {
      return this.getByCoords(coords);
    }
    return null;
  }

  getSafeByCoords(coords: { x: number; y: number }): T | null {
    if (this.checkCoords(coords)) {
      return this.getByCoords(coords);
    }
    return null;
  }
}
