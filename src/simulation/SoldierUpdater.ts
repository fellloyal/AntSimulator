import { PI, getAngle } from '@/common/math';
import { RNG } from '@/common/RNG';
import { Mode, FightMode, type SamplingResult, type AntRef } from '@/simulation/types';
import { getIntensity, isPermanent, checkFight, checkEnemyPresence, getEnemyFromCell } from '@/simulation/WorldGrid';
import { Ant, type WorldLike } from '@/simulation/Ant';

export class SoldierUpdater {
  // Antenna sampling parameters (same approach as WorkerUpdater)
  static readonly ANTENNA_ANGLE = 0.5;       // ±29° from forward
  static readonly ANTENNA_DIST_MIN = 8.0;
  static readonly ANTENNA_DIST_MAX = 18.0;
  static readonly EXPLORATION_SAMPLES = 12;  // Reduced from 64
  static readonly TURN_STRENGTH = 4.0;       // Stronger turn for soldiers

  static findMarker(ant: Ant, world: WorldLike): void {
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
    const currentAngle = ant.direction.angle;
    ant.fightRequest.active = false;

    // === Phase 1: Dual antenna sampling ===
    const leftAngle = currentAngle - SoldierUpdater.ANTENNA_ANGLE;
    const rightAngle = currentAngle + SoldierUpdater.ANTENNA_ANGLE;
    const antennaDist = RNG.getRange(SoldierUpdater.ANTENNA_DIST_MAX - SoldierUpdater.ANTENNA_DIST_MIN)
      + SoldierUpdater.ANTENNA_DIST_MIN;

    // Left antenna sample
    const leftDir = { x: Math.cos(leftAngle), y: Math.sin(leftAngle) };
    const leftPos = {
      x: ant.position.x + antennaDist * leftDir.x,
      y: ant.position.y + antennaDist * leftDir.y,
    };
    const leftCell = world.map.getSafe(leftPos);
    const leftHit = world.map.getFirstHit(ant.position, leftDir, antennaDist);

    // Right antenna sample
    const rightDir = { x: Math.cos(rightAngle), y: Math.sin(rightAngle) };
    const rightPos = {
      x: ant.position.x + antennaDist * rightDir.x,
      y: ant.position.y + antennaDist * rightDir.y,
    };
    const rightCell = world.map.getSafe(rightPos);
    const rightHit = world.map.getFirstHit(ant.position, rightDir, antennaDist);

    let leftIntensity = 0.0;
    let rightIntensity = 0.0;
    let foundFightDir: { x: number; y: number } | null = null;

    // Process left antenna
    if (leftCell && !leftHit.cell) {
      // Check for close enemy
      if (antennaDist < ant.length) {
        const enemy: AntRef = getEnemyFromCell(leftCell, ant.colId);
        if (enemy.active) {
          ant.requestFight(enemy);
          return;
        }
      }
      // Check for colony
      if (isPermanent(leftCell, ant.colId) && markerPhase === Mode.ToHome) {
        result.maxDirection = leftDir;
        result.foundPermanent = true;
      }
      // Check for fight
      if (checkFight(leftCell, ant.colId)) {
        foundFightDir = leftDir;
        ant.detectEnemy();
      }
      if (checkEnemyPresence(leftCell, ant.colId)) {
        ant.detectEnemy();
      }
      // Get marker intensity
      leftIntensity = getIntensity(leftCell, markerPhase, ant.colId) * leftCell.wallDist * leftCell.wallDist;
    }

    // Process right antenna
    if (rightCell && !rightHit.cell) {
      if (antennaDist < ant.length) {
        const enemy: AntRef = getEnemyFromCell(rightCell, ant.colId);
        if (enemy.active) {
          ant.requestFight(enemy);
          return;
        }
      }
      if (isPermanent(rightCell, ant.colId) && markerPhase === Mode.ToHome) {
        result.maxDirection = rightDir;
        result.foundPermanent = true;
      }
      if (checkFight(rightCell, ant.colId)) {
        foundFightDir = rightDir;
        ant.detectEnemy();
      }
      if (checkEnemyPresence(rightCell, ant.colId)) {
        ant.detectEnemy();
      }
      rightIntensity = getIntensity(rightCell, markerPhase, ant.colId) * rightCell.wallDist * rightCell.wallDist;
    }

    // Handle immediate targets
    if (foundFightDir) {
      ant.direction.setAngle(getAngle(foundFightDir));
      ant.fightMode = FightMode.ToFight;
      return;
    }

    if (result.foundPermanent) {
      ant.direction.setAngle(getAngle(result.maxDirection));
      return;
    }

    // === Phase 2: Apply antenna-based turning ===
    const intensityDiff = rightIntensity - leftIntensity;
    const maxAntennaIntensity = Math.max(leftIntensity, rightIntensity);

    if (maxAntennaIntensity > 0.1) {
      const turnAngle = intensityDiff / maxAntennaIntensity * SoldierUpdater.TURN_STRENGTH;
      ant.direction.addAngle(turnAngle);
      result.maxIntensity = maxAntennaIntensity;
      if (leftIntensity > rightIntensity) {
        result.maxCell = leftCell;
      } else {
        result.maxCell = rightCell;
      }
    }

    // === Phase 3: Random exploration (reduced samples, narrower arc) ===
    const sampleAngleRange = PI * 0.6; // Narrower than old 0.7
    for (let i = SoldierUpdater.EXPLORATION_SAMPLES; i-- > 0; ) {
      const deltaAngle = RNG.getRange(sampleAngleRange);
      const sampleAngle = currentAngle + deltaAngle;
      const distance = RNG.getUnder(Ant.markerDetectionMaxDist);
      const toMarker = { x: Math.cos(sampleAngle), y: Math.sin(sampleAngle) };
      const cell = world.map.getSafe({
        x: ant.position.x + distance * toMarker.x,
        y: ant.position.y + distance * toMarker.y,
      });
      const hitResult = world.map.getFirstHit(ant.position, toMarker, distance);

      if (!cell || hitResult.cell) continue;

      // Check for close enemy
      if (distance < ant.length) {
        const enemy: AntRef = getEnemyFromCell(cell, ant.colId);
        if (enemy.active) {
          ant.requestFight(enemy);
          return;
        }
      }

      // Check for colony
      if (isPermanent(cell, ant.colId) && markerPhase === Mode.ToHome) {
        result.maxDirection = toMarker;
        result.foundPermanent = true;
        break;
      }

      // Check for fight
      if (checkFight(cell, ant.colId)) {
        result.foundFight = true;
        result.maxDirection = toMarker;
        ant.detectEnemy();
        break;
      }

      // Check for enemy presence
      if (checkEnemyPresence(cell, ant.colId)) {
        ant.detectEnemy();
      }

      // Check for the most intense marker
      const markerIntensity = getIntensity(cell, markerPhase, ant.colId) * cell.wallDist * cell.wallDist;
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
