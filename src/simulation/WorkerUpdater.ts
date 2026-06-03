import { PI, getAngle } from '@/common/math';
import { RNG } from '@/common/RNG';
import { Config } from '@/simulation/Config';
import { Mode, FightMode, type SamplingResult } from '@/simulation/types';
import { getIntensity, isPermanent, getRepellent, setRepellent, degrade, addPresence, checkEnemyPresence, checkFight } from '@/simulation/WorldGrid';
import { Ant, type WorldLike } from '@/simulation/Ant';

export class WorkerUpdater {
  static findMarker(ant: Ant, world: WorldLike): void {
    const sampleAngleRange = PI * 0.5;
    const sampleCount = 32;
    const repellentProbFactor = 0.3;

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

    for (let i = sampleCount; i-- > 0; ) {
      const deltaAngle = RNG.getRange(sampleAngleRange);
      const sampleAngle = currentAngle + deltaAngle;
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

      // Check for food or colony
      if (
        (isPermanent(cell, ant.colId) && markerPhase === Mode.ToHome) ||
        (markerPhase === Mode.ToFood && cell.food > 0)
      ) {
        result.maxDirection = toMarker;
        result.foundPermanent = true;
        break;
      }

      // Check for enemy
      if (checkEnemyPresence(cell, ant.colId)) {
        ant.detectEnemy();
      }

      // Help in case of a fight
      if (checkFight(cell, ant.colId)) {
        result.foundFight = true;
        result.maxDirection = toMarker;
        ant.detectEnemy();
        break;
      }

      // Flee if repellent
      const cellRepellent = getRepellent(cell, ant.colId);
      if (cellRepellent > result.maxRepellent) {
        result.maxRepellent = cellRepellent;
        result.repellentCell = cell;
      }

      // Check for the most intense marker
      const wallRep = cell.wallDist * cell.wallDist;
      const markerIntensity = getIntensity(cell, markerPhase, ant.colId) * wallRep;
      if (markerIntensity > result.maxIntensity) {
        result.maxIntensity = markerIntensity;
        result.maxDirection = toMarker;
        result.maxCell = cell;
      }

      // Eventually choose a different path
      if (RNG.proba(ant.libertyCoef)) {
        break;
      }
    }

    if (result.foundFight) {
      ant.direction.setAngle(getAngle(result.maxDirection));
      ant.fightMode = FightMode.ToFight;
      return;
    }

    // Check for repellent
    if (ant.phase === Mode.ToFood && result.maxRepellent > 0 && !result.foundPermanent) {
      if (RNG.proba(repellentProbFactor * (1.0 - result.maxIntensity / Config.MARKER_INTENSITY))) {
        ant.direction.addNow(RNG.getUnder(2.0 * PI));
        ant.searchMarkers.reset();
        return;
      }
    }

    // Degrade repellent if still food
    if (result.repellentCell && ant.phase === Mode.ToHome) {
      const rep = getRepellent(result.repellentCell, ant.colId);
      setRepellent(result.repellentCell, ant.colId, rep * 0.95);
    }

    // Update direction
    if (result.maxIntensity > 0) {
      if (RNG.proba(0.2) && ant.phase === Mode.ToFood && result.maxCell) {
        degrade(result.maxCell, ant.colId, ant.phase, 0.99);
      }
      ant.direction.setAngle(getAngle(result.maxDirection));
    }
  }

  static update(ant: Ant, world: WorldLike, dt: number): void {
    // Check collision with food
    if (ant.phase === Mode.ToFood) {
      ant.checkFood(world);
    }
    // Get current cell
    const cell = world.map.get(ant.position);
    addPresence(cell);
    ant.searchMarkers.update(dt);
    if (ant.directionUpdate.updateAutoReset(dt)) {
      if (ant.searchMarkers.ready()) {
        WorkerUpdater.findMarker(ant, world);
        ant.direction.addAngle(RNG.getFullRange(Ant.directionNoiseRange));
      } else {
        // Fleeing from repellent
        degrade(cell, ant.colId, Mode.ToFood, 0.25);
        ant.direction.addAngle(RNG.getFullRange(2.0 * Ant.directionNoiseRange));
      }
    }
    // Add marker
    if (ant.markerAdd.updateAutoReset(dt)) {
      ant.addMarker(world);
    }
  }
}
