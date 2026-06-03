import { PI, getAngle } from '@/common/math';
import { RNG } from '@/common/RNG';
import { Config } from '@/simulation/Config';
import { Mode, FightMode, type SamplingResult } from '@/simulation/types';
import { getIntensity, isPermanent, getRepellent, setRepellent, degrade, addPresence, checkEnemyPresence, checkFight } from '@/simulation/WorldGrid';
import { Ant, type WorldLike } from '@/simulation/Ant';

export class WorkerUpdater {
  // Antenna sampling parameters
  static readonly ANTENNA_ANGLE = 0.45;       // ±25° from forward
  static readonly ANTENNA_DIST_MIN = 8.0;
  static readonly ANTENNA_DIST_MAX = 15.0;
  static readonly EXPLORATION_SAMPLES = 8;    // Fewer random exploration samples
  static readonly TURN_STRENGTH = 3.0;        // How strongly to turn based on antenna diff

  static findMarker(ant: Ant, world: WorldLike): void {
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
    const currentAngle = ant.direction.angle;

    // === Phase 1: Dual antenna sampling ===
    const leftAngle = currentAngle - WorkerUpdater.ANTENNA_ANGLE;
    const rightAngle = currentAngle + WorkerUpdater.ANTENNA_ANGLE;
    const antennaDist = RNG.getRange(WorkerUpdater.ANTENNA_DIST_MAX - WorkerUpdater.ANTENNA_DIST_MIN)
      + WorkerUpdater.ANTENNA_DIST_MIN;

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
    let foundFood = false;
    let foundColony = false;
    let foundFightDir: { x: number; y: number } | null = null;

    // Process left antenna
    if (leftCell && !leftHit.cell) {
      // Check for food/colony
      if ((isPermanent(leftCell, ant.colId) && markerPhase === Mode.ToHome) ||
          (markerPhase === Mode.ToFood && leftCell.food > 0)) {
        foundColony = true;
        result.maxDirection = leftDir;
        result.foundPermanent = true;
      }
      // Check for fight
      if (checkFight(leftCell, ant.colId)) {
        foundFightDir = leftDir;
        ant.detectEnemy();
      }
      // Check for enemy
      if (checkEnemyPresence(leftCell, ant.colId)) {
        ant.detectEnemy();
      }
      // Get marker intensity
      const wallRep = leftCell.wallDist * leftCell.wallDist;
      leftIntensity = getIntensity(leftCell, markerPhase, ant.colId) * wallRep;
      // Track repellent
      const rep = getRepellent(leftCell, ant.colId);
      if (rep > result.maxRepellent) {
        result.maxRepellent = rep;
        result.repellentCell = leftCell;
      }
    }

    // Process right antenna
    if (rightCell && !rightHit.cell) {
      if ((isPermanent(rightCell, ant.colId) && markerPhase === Mode.ToHome) ||
          (markerPhase === Mode.ToFood && rightCell.food > 0)) {
        foundFood = true;
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
      const wallRep = rightCell.wallDist * rightCell.wallDist;
      rightIntensity = getIntensity(rightCell, markerPhase, ant.colId) * wallRep;
      const rep = getRepellent(rightCell, ant.colId);
      if (rep > result.maxRepellent) {
        result.maxRepellent = rep;
        result.repellentCell = rightCell;
      }
    }

    // Handle immediate targets
    if (foundFightDir) {
      ant.direction.setAngle(getAngle(foundFightDir));
      ant.fightMode = FightMode.ToFight;
      return;
    }

    if (foundFood || foundColony) {
      ant.direction.setAngle(getAngle(result.maxDirection));
      return;
    }

    // === Phase 2: Apply antenna-based turning ===
    const intensityDiff = rightIntensity - leftIntensity;
    const maxIntensity = Math.max(leftIntensity, rightIntensity);

    if (maxIntensity > 0.1) {
      // Turn towards stronger signal
      const turnAngle = intensityDiff / maxIntensity * WorkerUpdater.TURN_STRENGTH;
      ant.direction.addAngle(turnAngle);
      result.maxIntensity = maxIntensity;
      if (leftIntensity > rightIntensity) {
        result.maxCell = leftCell;
      } else {
        result.maxCell = rightCell;
      }
    }

    // === Phase 3: Random exploration (fewer samples) ===
    const sampleAngleRange = PI * 0.5;
    for (let i = WorkerUpdater.EXPLORATION_SAMPLES; i-- > 0; ) {
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

      // Check for food or colony
      if ((isPermanent(cell, ant.colId) && markerPhase === Mode.ToHome) ||
          (markerPhase === Mode.ToFood && cell.food > 0)) {
        ant.direction.setAngle(sampleAngle);
        return;
      }

      // Check for fight
      if (checkFight(cell, ant.colId)) {
        ant.direction.setAngle(sampleAngle);
        ant.fightMode = FightMode.ToFight;
        ant.detectEnemy();
        return;
      }

      // Check for enemy presence
      if (checkEnemyPresence(cell, ant.colId)) {
        ant.detectEnemy();
      }

      // Track repellent
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
        ant.direction.setAngle(sampleAngle);
      }

      // Liberty: occasionally choose a different path
      if (RNG.proba(ant.libertyCoef)) {
        break;
      }
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

    // Degrade markers slightly when following
    if (result.maxIntensity > 0 && RNG.proba(0.2) && ant.phase === Mode.ToFood && result.maxCell) {
      degrade(result.maxCell, ant.colId, ant.phase, 0.99);
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
