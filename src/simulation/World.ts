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
      x: toInt(position.x / this.map.cellSize),
      y: toInt(position.y / this.map.cellSize),
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

  // UI美化新增：设置 cell 地形（task 8）
  setTerrain(cx: number, cy: number, terrain: number): void {
    if (this.map.checkCoords({ x: cx, y: cy })) {
      const cell = this.map.getByCoords({ x: cx, y: cy });
      cell.terrain = terrain;
      // 水地形默认不可通过（视为墙）
      if (terrain === 2 && !cell.wall) {
        cell.wall = 1;
        this.map.computeDistanceFieldAround(cx, cy);
      } else if (terrain !== 2 && cell.obstacle === 0 && cell.wall) {
        // 切换非水地形时，如果当前是墙但没有 obstacle，可能是水，降级
        // 这里保守：不动 wall，由后续 setObstacle 处理
      }
    }
  }

  // UI美化新增：设置障碍物（task 8）
  setObstacle(cx: number, cy: number, obstacle: number): void {
    if (this.map.checkCoords({ x: cx, y: cy })) {
      const cell = this.map.getByCoords({ x: cx, y: cy });
      cell.obstacle = obstacle;
      cell.wall = obstacle !== 0 ? 1 : 0;
      if (obstacle === 0) cell.food = 0;
      this.map.computeDistanceFieldAround(cx, cy);
    }
  }

  // UI美化新增：设置食物种类（task 8）
  setFoodType(cx: number, cy: number, foodType: number): void {
    if (this.map.checkCoords({ x: cx, y: cy })) {
      this.map.getByCoords({ x: cx, y: cy }).foodType = foodType;
    }
  }

  // UI美化新增：累加 cell 磨损（task 9, 由 Ant.updatePosition 调用）
  bumpWear(cx: number, cy: number, amount: number = 0.001): void {
    if (this.map.checkCoords({ x: cx, y: cy })) {
      const cell = this.map.getByCoords({ x: cx, y: cy });
      if (cell.wall) return; // 墙不磨损
      if (cell.wearLevel < 1) {
        cell.wearLevel = Math.min(1, cell.wearLevel + amount);
      }
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
      x: toInt(x / this.map.cellSize),
      y: toInt(y / this.map.cellSize),
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
