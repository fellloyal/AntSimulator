import { toInt } from '@/common/math';
import { Mode, type ColonyCell } from '@/simulation/types';
import { WorldGrid } from '@/simulation/WorldGrid';

export class World {
  size: { x: number; y: number };
  map: WorldGrid;

  constructor(width: number, height: number) {
    this.map = new WorldGrid(width, height, 4);
    this.size = { x: width, y: height };

    // Create walls around the map
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        if (x === 0 || x === this.map.width - 1 || y === 0 || y === this.map.height - 1) {
          this.map.getByCoords({ x, y }).wall = 1;
        }
      }
    }
    this.map.computeDistanceField();
  }

  update(dt: number): void {
    this.map.update(dt);
  }

  addMarker(
    pos: { x: number; y: number },
    type: Mode,
    intensity: number,
    colonyId: number,
    permanent: boolean = false
  ): void {
    this.map.addMarker(pos, type, intensity, colonyId, permanent);
  }

  addMarkerRepellent(pos: { x: number; y: number }, colonyId: number, amount: number): void {
    const cell = this.map.getSafe(pos);
    if (cell) {
      cell.markers[colonyId].repellent += amount;
    }
  }

  addWall(position: { x: number; y: number }): void {
    const coords = {
      x: toInt(position.x) / this.map.cellSize,
      y: toInt(position.y) / this.map.cellSize,
    };
    this.addWallByCoords(coords);
  }

  addWallByCoords(position: { x: number; y: number }): void {
    if (this.map.checkCoords(position)) {
      const cell = this.map.getByCoords(position);
      cell.food = 0;
      cell.wall = 1;
      for (const markers of cell.markers) {
        World.clearMarkersOfCell(markers);
      }
      this.map.computeDistanceFieldAround(position.x, position.y);
    }
  }

  removeWall(position: { x: number; y: number }): void {
    if (this.map.checkCoords(position)) {
      this.map.get(position).wall = 0;
      this.map.computeDistanceFieldAround(position.x, position.y);
    }
  }

  addFoodAt(x: number, y: number, quantity: number): void {
    const coords = {
      x: toInt(x) / this.map.cellSize,
      y: toInt(y) / this.map.cellSize,
    };
    if (this.map.checkCoords(coords)) {
      this.map.addMarkerByCoords(coords, Mode.ToFood, 1.0, 0, true);
      this.map.addFoodByCoords(coords, quantity);
    }
  }

  clearMarkers(colonyId: number): void {
    for (const cell of this.map.cells) {
      World.clearMarkersOfCell(cell.markers[colonyId]);
      cell.density = 0.0;
    }
  }

  static clearMarkersOfCell(cell: ColonyCell): void {
    cell.intensity[0] = 0.0;
    cell.intensity[1] = 0.0;
    cell.intensity[2] = 0.0;
    cell.repellent = 0.0;
    cell.permanent = false;
  }
}
