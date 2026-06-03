import { PI, getAngle } from '@/common/math';
import { RNG } from '@/common/RNG';
import { Mode, FightMode, type SamplingResult, type AntRef } from '@/simulation/types';
import { getIntensity, isPermanent, checkFight, getEnemyFromCell } from '@/simulation/WorldGrid';
import { Ant, type WorldLike } from '@/simulation/Ant';

export class SoldierUpdater {
  static findMarker(ant: Ant, world: WorldLike): void {
    const sampleAngleRange = PI * 0.7;
    const sampleCount = 64;

    const result: SamplingResult = {
      maxIntensity: 0.0,
      maxDirection: ant.direction.getVec(),
      maxCell: null,
      foundPermanent: false,
      foundFight: false,
      maxRepellent: 0.0,
      repellentCell: null,
    };

    const markerPhase = ant.getMarkersSamplingType();
    const currentAngle = getAngle(result.maxDirection);
    ant.fightRequest.active = false;

    for (let i = sampleCount; i-- > 0; ) {
      const sampleAngle = currentAngle + RNG.getRange(sampleAngleRange);
      const distance = RNG.getUnder(Ant.markerDetectionMaxDist);
      const toMarker = { x: Math.cos(sampleAngle), y: Math.sin(sampleAngle) };
      const cell = world.map.getSafe({
        x: ant.position.x + distance * toMarker.x,
        y: ant.position.y + distance * toMarker.y,
      });
      const hitResult = world.map.getFirstHit(ant.position, toMarker, distance);

      if (!cell || hitResult.cell) {
        continue;
      }

      // Check for colony
      if (isPermanent(cell, ant.colId) && markerPhase === Mode.ToHome) {
        result.maxDirection = toMarker;
        result.foundPermanent = true;
        break;
      }

      // Check for close enemy
      if (distance < ant.length) {
        const enemy: AntRef = getEnemyFromCell(cell, ant.colId);
        if (enemy.active) {
          ant.requestFight(enemy);
          return;
        }
      }

      // Check for enemy fight
      if (checkFight(cell, ant.colId)) {
        result.foundFight = true;
        result.maxDirection = toMarker;
        ant.detectEnemy();
        break;
      }

      // Check for the most intense marker
      const markerIntensity = getIntensity(cell, markerPhase, ant.colId) * Math.pow(cell.wallDist, 2.0);
      if (markerIntensity > result.maxIntensity) {
        result.maxIntensity = markerIntensity;
        result.maxDirection = toMarker;
        result.maxCell = cell;
      }
    }

    // Process sampling result
    if (result.foundFight) {
      ant.direction.setAngle(getAngle(result.maxDirection));
      ant.fightMode = FightMode.ToFight;
      return;
    }

    // Update direction
    if (result.maxIntensity > 0) {
      ant.direction.setAngle(getAngle(result.maxDirection));
    }
  }

  static update(ant: Ant, world: WorldLike, dt: number): void {
    const cell = world.map.get(ant.position);
    cell.density += 1.0;
    if (ant.directionUpdate.updateAutoReset(dt)) {
      SoldierUpdater.findMarker(ant, world);
    }
  }
}
