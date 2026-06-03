import { Grid } from '@/common/Grid';
import { toInt } from '@/common/math';
import { Config } from '@/simulation/Config';
import {
  type ColonyCell,
  type WorldCell,
  type HitPoint,
  Mode,
} from '@/simulation/types';

export type { ColonyCell, WorldCell, HitPoint };

const MIN_INTENSITY = 0.1;

function createColonyCell(): ColonyCell {
  return {
    intensity: [0.0, 0.0, 0.0],
    permanent: false,
    repellent: 0.0,
    currentAnt: -1,
    fighting: false,
  };
}

function createWorldCell(): WorldCell {
  const markers: ColonyCell[] = [];
  for (let i = 0; i < Config.MAX_COLONIES_COUNT; i++) {
    markers.push(createColonyCell());
  }
  return {
    markers,
    food: 0,
    wall: 0,
    density: 0.0,
    wallDist: 0.0,
    discovered: 1.0,
  };
}

export function updateColonyCell(cell: ColonyCell, dt: number): void {
  cell.currentAnt = -1;
  cell.fighting = false;
  cell.intensity[0] -= cell.permanent ? 0.0 : dt;
  cell.intensity[1] -= dt;
  cell.intensity[2] -= dt;
  cell.repellent -= dt;
  cell.repellent = Math.max(0.0, cell.repellent);
}

export function updateWorldCell(cell: WorldCell, dt: number): void {
  for (let i = Config.MAX_COLONIES_COUNT; i-- > 0; ) {
    updateColonyCell(cell.markers[i], dt);
  }
  cell.density *= 0.99;
}

export function pickFoodFromCell(cell: WorldCell): boolean {
  const last = cell.food <= 1;
  cell.food = (cell.food - (cell.food > 0 ? 1 : 0)) * (last ? 0 : 1);
  return last;
}

export function getEnemyFromCell(cell: WorldCell, team: number): { active: boolean; colId: number; antId: number } {
  for (let i = Config.MAX_COLONIES_COUNT; i-- > 0; ) {
    if (i !== team && cell.markers[i].currentAnt > -1) {
      return { active: true, antId: cell.markers[i].currentAnt, colId: i };
    }
  }
  return { active: false, antId: 0, colId: 0 };
}

export function checkEnemyPresence(cell: WorldCell, team: number): boolean {
  for (let i = 0; i < Config.MAX_COLONIES_COUNT; i++) {
    if (i !== team && cell.markers[i].currentAnt > -1) {
      return true;
    }
  }
  return false;
}

export function checkFight(cell: WorldCell, colonyId: number): boolean {
  return cell.markers[colonyId].fighting;
}

export function getRepellent(cell: WorldCell, colonyId: number): number {
  return cell.markers[colonyId].repellent;
}

export function setRepellent(cell: WorldCell, colonyId: number, value: number): void {
  cell.markers[colonyId].repellent = value;
}

export function getIntensity(cell: WorldCell, mode: Mode, colonyId: number): number {
  return Math.max(MIN_INTENSITY, cell.markers[colonyId].intensity[mode as number]);
}

export function isPermanent(cell: WorldCell, colonyId: number): boolean {
  return cell.markers[colonyId].permanent;
}

export function degrade(cell: WorldCell, colonyId: number, mode: Mode, ratio: number): void {
  cell.markers[colonyId].intensity[mode as number] *= ratio;
}

export function addPresence(cell: WorldCell): void {
  cell.density += 1.0;
}

export class WorldGrid extends Grid<WorldCell> {
  constructor(width: number, height: number, cellSize: number) {
    super(width, height, cellSize, createWorldCell);
  }

  addMarker(
    pos: { x: number; y: number } | { x: number; y: number },
    type: Mode,
    intensity: number,
    colonyId: number,
    permanent: boolean = false
  ): void {
    const coords = {
      x: toInt((pos as { x: number; y: number }).x / this.cellSize),
      y: toInt((pos as { x: number; y: number }).y / this.cellSize),
    };
    this.addMarkerByCoords(coords, type, intensity, colonyId, permanent);
  }

  addMarkerByCoords(
    coords: { x: number; y: number },
    type: Mode,
    intensity: number,
    colonyId: number,
    permanent: boolean = false
  ): void {
    if (!this.checkCoords(coords)) return;
    const cell = this.getByCoords(coords);
    const colonyCell = cell.markers[colonyId];
    const modeIndex = type as number;
    colonyCell.intensity[modeIndex] = Math.max(colonyCell.intensity[modeIndex], intensity);
    colonyCell.permanent = colonyCell.permanent || permanent;
  }

  addFood(pos: { x: number; y: number }, quantity: number): void {
    const coords = { x: toInt(pos.x), y: toInt(pos.y) };
    this.addFoodByCoords(coords, quantity);
  }

  addFoodByCoords(coords: { x: number; y: number }, quantity: number): void {
    if (!this.checkCoords(coords)) return;
    const cell = this.getByCoords(coords);
    if (!cell.wall) {
      cell.food += quantity;
    }
  }

  isOnFood(pos: { x: number; y: number }): boolean {
    const cell = this.getSafe(pos);
    return cell !== null && cell.food > 0;
  }

  pickFood(pos: { x: number; y: number }): boolean {
    const cell = this.get(pos);
    return pickFoodFromCell(cell);
  }

  clearCell(coords: { x: number; y: number }): void {
    const cell = this.getByCoords(coords);
    cell.wall = 0;
    cell.food = 0;
  }

  update(dt: number): void {
    for (let i = 0; i < this.cells.length; i++) {
      updateWorldCell(this.cells[i], dt);
    }
  }

  getFirstHit(
    p: { x: number; y: number },
    d: { x: number; y: number },
    maxDist: number
  ): HitPoint {
    const intersection: HitPoint = {
      cell: null,
      normal: { x: 0, y: 0 },
      distance: -1.0,
    };

    let cellP = this.getCellCoords(p);
    const step = {
      x: d.x < 0.0 ? -1 : 1,
      y: d.y < 0.0 ? -1 : 1,
    };
    const invD = {
      x: 1.0 / d.x,
      y: 1.0 / d.y,
    };
    const tDx = Math.abs(this.cellSize * invD.x);
    const tDy = Math.abs(this.cellSize * invD.y);
    let tMaxX = ((cellP.x + (step.x > 0 ? 1 : 0)) * this.cellSize - p.x) * invD.x;
    let tMaxY = ((cellP.y + (step.y > 0 ? 1 : 0)) * this.cellSize - p.y) * invD.y;
    let dist = 0.0;

    while (dist < maxDist) {
      const b = tMaxX < tMaxY ? 1 : 0;
      dist = b * tMaxX + (1 - b) * tMaxY;
      tMaxX += tDx * b;
      tMaxY += tDy * (1 - b);
      cellP.x += step.x * b;
      cellP.y += step.y * (1 - b);

      if (!this.checkCoords(cellP)) {
        return intersection;
      } else {
        const cell = this.getByCoords(cellP);
        if (cell.wall) {
          intersection.cell = cell;
          intersection.normal = { x: b, y: 1 - b };
          intersection.distance = dist;
          return intersection;
        }
      }
    }
    return intersection;
  }
}
