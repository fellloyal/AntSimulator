import { PI, getAngle, getNormalized } from '@/common/math';
import { RNG } from '@/common/RNG';
import { Cooldown } from '@/common/Cooldown';
import { Direction } from '@/common/Direction';
import { Config } from '@/simulation/Config';
import { Mode, FightMode, AntType, type AntRef } from '@/simulation/types';
import type { ColonyBase } from '@/simulation/ColonyBase';

// We avoid importing World directly to prevent circular deps.
// Instead, World is passed as a parameter to methods that need it.
// The World interface we need:
export interface WorldLike {
  map: import('@/simulation/WorldGrid').WorldGrid;
  addMarker(pos: { x: number; y: number }, type: Mode, intensity: number, colonyId: number, permanent?: boolean): void;
  addMarkerRepellent(pos: { x: number; y: number }, colonyId: number, amount: number): void;
  addFoodAt(x: number, y: number, quantity: number): void;
  bumpWear(cx: number, cy: number, amount?: number): void;
}

export class Ant {
  // Static constants
  static readonly moveSpeed = 40.0;
  static readonly markerDetectionMaxDist = 40.0;
  static readonly directionUpdatePeriod = 0.25;
  static readonly markerPeriod = 0.25;
  static readonly directionNoiseRange = PI * 0.02;
  static readonly repellentPeriod = 128.0;

  // Properties
  width = 3.0;
  length = 4.7;
  phase: Mode = Mode.ToFood;
  hits = 0;
  position: { x: number; y: number };
  direction: Direction;

  // Fight info
  fightMode: FightMode = FightMode.NoFight;
  damage = 30.0;
  fightDist = this.length * 0.25;
  target: Ant | null = null;
  fightPos: { x: number; y: number } = { x: 0, y: 0 };
  fightVec: { x: number; y: number } = { x: 0, y: 0 };
  enemyFound = false;
  enemyIntensity = 0.0;
  toFightTimeout = 1.0;
  toFightTime = 0.0;
  fightRequest: AntRef = { active: false, colId: 0, antUid: 0 };

  // Cooldowns
  attackCooldown: Cooldown;
  directionUpdate: Cooldown;
  markerAdd: Cooldown;
  searchMarkers: Cooldown;

  // Timers
  internalClock = 0.0;
  toEnemyMarkersCount = 0.0;
  maxAutonomy = 300.0;
  libertyCoef = 0.0;
  autonomy = 0.0;

  // Walking wobble
  wobblePhase: number;
  wobbleFreq = 4.0;

  // Occasional pause
  pauseTimer = 0.0;
  isPaused = false;

  // Death fade-out
  dyingTimer = 0.0;
  static readonly DYING_DURATION = 2.0;

  // Identity
  id = 0;
  uid: number;  // Unique immutable ID, never changes after creation
  colId = 0;
  type: AntType = AntType.Worker;
  private static nextUid = 0;

  constructor(x: number, y: number, angle: number, colonyId: number) {
    this.position = { x, y };
    this.direction = new Direction(angle);
    this.directionUpdate = new Cooldown(
      Ant.directionUpdatePeriod,
      RNG.getUnder(1.0) * Ant.directionUpdatePeriod
    );
    this.markerAdd = new Cooldown(
      Ant.markerPeriod,
      RNG.getUnder(1.0) * Ant.markerPeriod
    );
    this.searchMarkers = new Cooldown(5.0, 5.0);
    this.phase = Mode.ToFood;
    this.libertyCoef = RNG.getRange(0.009) + 0.001; // getRange(0.001, 0.01)
    this.fightMode = FightMode.NoFight;
    this.colId = colonyId;
    this.uid = Ant.nextUid++;
    this.attackCooldown = new Cooldown(1.0, 0.0);
    this.type = AntType.Worker;
    this.wobblePhase = RNG.getUnder(2 * PI);
  }

  addToWorldGrid(world: WorldLike): void {
    const cell = world.map.getSafe(this.position);
    if (!cell) {
      this.terminate();
      return;
    }
    const colonyCell = cell.markers[this.colId];
    if (!colonyCell.fighting) {
      colonyCell.currentAnt = this.uid;
      colonyCell.fighting = this.isFighting();
    }
  }

  removeFromWorldGrid(world: WorldLike): void {
    const cell = world.map.getSafe(this.position);
    if (cell) {
      const colonyCell = cell.markers[this.colId];
      if (colonyCell.currentAnt === this.id) {
        colonyCell.currentAnt = -1;
      }
    }
  }

  isFighting(): boolean {
    return this.fightMode === FightMode.Fighting;
  }

  attack(dt: number): void {
    if (this.target && !this.target.isDead() && this.target.phase !== Mode.Dying) {
      const opponent = this.target;
      this.position = {
        x: this.fightPos.x - this.fightVec.x * (0.5 * this.length + this.attackCooldown.getRatio() * this.fightDist),
        y: this.fightPos.y - this.fightVec.y * (0.5 * this.length + this.attackCooldown.getRatio() * this.fightDist),
      };
      this.attackCooldown.update(dt);
      if (this.attackCooldown.ready()) {
        this.attackCooldown.reset();
        opponent.autonomy += this.damage;
      }
    } else {
      this.fightMode = FightMode.NoFight;
      this.target = null;
      if (this.type === AntType.Soldier) {
        this.autonomy = Math.max(0.0, this.autonomy - 3.0);
      }
    }
  }

  updatePosition(world: WorldLike, dt: number): void {
    const speed = this.getMoveSpeed();
    const v = this.direction.getVec();
    const hit = world.map.getFirstHit(this.position, v, dt * speed);
    if (hit.cell) {
      const hitsThreshold = 4;
      if (this.hits > hitsThreshold) {
        this.terminate();
      } else {
        v.x *= hit.normal.x !== 0.0 ? -1.0 : 1.0;
        v.y *= hit.normal.y !== 0.0 ? -1.0 : 1.0;
      }
      this.hits++;
      this.direction.setDirectionNow(v);
    } else {
      this.hits = 0;
      this.position.x += dt * speed * v.x;
      this.position.y += dt * speed * v.y;
      // UI美化：蚂蚁移动后累加 cell 磨损（task 9）
      const cx = Math.floor(this.position.x / world.map.cellSize);
      const cy = Math.floor(this.position.y / world.map.cellSize);
      world.bumpWear(cx, cy, 0.001);
      if (
        this.position.x < 0.0 ||
        this.position.x > Config.WORLD_WIDTH ||
        this.position.y < 0.0 ||
        this.position.y > Config.WORLD_HEIGHT
      ) {
        this.terminate();
      }
    }
  }

  checkFood(world: WorldLike): void {
    if (world.map.isOnFood(this.position)) {
      this.phase = Mode.ToHome;
      this.direction.addNow(PI);
      this.autonomy = 0.0;
      this.internalClock = 0.0;
      if (world.map.pickFood(this.position)) {
        this.phase = Mode.ToHomeNoFood;
        this.markerAdd.target = Ant.repellentPeriod;
        this.markerAdd.value = RNG.getUnder(this.markerAdd.target);
        world.addMarkerRepellent(this.position, this.colId, 300.0);
      }
    }
  }

  checkColony(base: ColonyBase): void {
    const dx = this.position.x - base.position.x;
    const dy = this.position.y - base.position.y;
    if (Math.sqrt(dx * dx + dy * dy) < base.radius) {
      // Don't interfere with dying or fighting ants
      if (this.phase === Mode.Dying || this.phase === Mode.Dead) return;
      this.markerAdd.target = Ant.markerPeriod;
      if (this.phase === Mode.ToHome || this.phase === Mode.ToHomeNoFood) {
        base.addFood(1.0);
        this.direction.addNow(PI);
        base.enemiesFoundCount += this.enemyFound ? 1 : 0;
      }
      if (!this.isFighting()) {
        this.autonomy = 0.0;
        this.enemyIntensity = 0.0;
        this.resetMarkers();
        this.enemyFound = false;
        if (this.type === AntType.Soldier) {
          this.phase = Mode.ToEnemy;
        } else {
          this.phase = Mode.ToFood;
        }
      }
    }
  }

  updateClocks(dt: number): void {
    this.autonomy += dt;
    this.internalClock += dt;
    this.toEnemyMarkersCount += dt;
    this.wobblePhase += this.wobbleFreq * dt * 2 * PI;
  }

  updateDying(dt: number): void {
    this.dyingTimer += dt;
    if (this.dyingTimer >= Ant.DYING_DURATION) {
      this.phase = Mode.Dead;
    }
  }

  getMoveSpeed(): number {
    if (this.isPaused) return 0.0;
    const baseSpeed = Ant.moveSpeed;
    // Carrying food: slower
    if (this.phase === Mode.ToHome || this.phase === Mode.ToHomeNoFood) {
      return baseSpeed * 0.8;
    }
    return baseSpeed;
  }

  getMarkersSamplingType(): Mode {
    if (this.phase === Mode.ToHome || this.phase === Mode.Refill || this.phase === Mode.ToHomeNoFood) {
      return Mode.ToHome;
    }
    return this.phase;
  }

  resetMarkers(): void {
    this.internalClock = 0.0;
    this.toEnemyMarkersCount = 0.0;
  }

  addMarker(world: WorldLike): void {
    if (this.phase === Mode.ToHome || this.phase === Mode.ToFood) {
      const intensity = Ant.getMarkerIntensity(0.05, this.internalClock);
      world.addMarker(
        this.position,
        this.phase === Mode.ToFood ? Mode.ToHome : Mode.ToFood,
        intensity,
        this.colId
      );
    } else if (this.phase === Mode.ToHomeNoFood) {
      const intensity = Ant.getMarkerIntensity(0.1, this.internalClock);
      world.addMarkerRepellent(this.position, this.colId, intensity);
    }
    if (this.enemyFound) {
      const intensity = Math.min(0.1, this.enemyIntensity) * Ant.getMarkerIntensity(0.05, this.toEnemyMarkersCount);
      world.addMarker(this.position, Mode.ToEnemy, intensity, this.colId);
    }
  }

  static getMarkerIntensity(coef: number, count: number): number {
    return Config.MARKER_INTENSITY * Math.exp(-coef * count);
  }

  setTarget(newTarget: Ant): void {
    this.fightRequest.active = false;
    this.fightMode = FightMode.Fighting;
    this.target = newTarget;
    this.fightPos = {
      x: 0.5 * (newTarget.position.x + this.position.x),
      y: 0.5 * (newTarget.position.y + this.position.y),
    };
    this.fightVec = getNormalized({
      x: newTarget.position.x - this.position.x,
      y: newTarget.position.y - this.position.y,
    });
    this.direction = new Direction(getAngle(this.fightVec));
    this.enemyFound = true;
  }

  kill(world: WorldLike): void {
    if (this.phase === Mode.ToHome || this.phase === Mode.ToHomeNoFood) {
      world.addFoodAt(this.position.x, this.position.y, 1);
    }
    this.phase = Mode.Dying;
    this.dyingTimer = 0.0;
    this.removeFromWorldGrid(world);
  }

  detectEnemy(): void {
    this.enemyFound = true;
    this.toEnemyMarkersCount = 0.0;
    this.toFightTime = 0.0;
    this.enemyIntensity += 0.001;
  }

  requestFight(ref: AntRef): void {
    this.fightMode = FightMode.ToFight;
    this.fightRequest = { ...ref };
  }

  terminate(): void {
    this.autonomy = this.maxAutonomy + 1.0;
  }

  isDone(): boolean {
    return this.autonomy >= this.maxAutonomy;
  }

  isDead(): boolean {
    return this.phase === Mode.Dead;
  }
}
