export enum Mode {
  ToHome = 0,
  ToFood = 1,
  ToEnemy = 2,
  Refill = 3,
  Flee = 4,
  ToHomeNoFood = 5,
  Dead = 6,
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
}

export interface HitPoint {
  cell: WorldCell | null;
  normal: { x: number; y: number };
  distance: number;
}

export interface AntRef {
  active: boolean;
  colId: number;
  antId: number;
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
