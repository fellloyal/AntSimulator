export enum Mode {
  ToHome = 0,
  ToFood = 1,
  ToEnemy = 2,
  Refill = 3,
  Flee = 4,
  ToHomeNoFood = 5,
  Dying = 6,
  Dead = 7,
}

export enum FightMode {
  Fighting = 0,
  ToFight = 1,
  NoFight = 2,
}

export enum AntType {
  Worker = 0,
  Soldier = 1,
}

export interface ColonyCell {
  intensity: [number, number, number]; // ToHome, ToFood, ToEnemy
  permanent: boolean;
  repellent: number;
  currentAnt: number;
  fighting: boolean;
}

export interface WorldCell {
  markers: ColonyCell[];
  food: number;
  wall: number;
  density: number;
  wallDist: number;
  discovered: number;
  // UI美化新增字段（不影响 simulation 计算）
  terrain: number;     // 0=grass 1=sand 2=water 3=rock
  obstacle: number;    // 0=none 1=brick 2=ice 3=wood 4=fence
  foodType: number;    // 0=chicken 1=apple 2=bread 3=berry
  wearLevel: number;   // 0~1，蚂蚁经过累积
}

export interface HitPoint {
  cell: WorldCell | null;
  normal: { x: number; y: number };
  distance: number;
}

export interface AntRef {
  active: boolean;
  colId: number;
  antUid: number;
}

export interface SamplingResult {
  maxIntensity: number;
  maxDirection: { x: number; y: number };
  maxCell: WorldCell | null;
  foundPermanent: boolean;
  foundFight: boolean;
  maxRepellent: number;
  repellentCell: WorldCell | null;
}
