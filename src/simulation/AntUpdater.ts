import { Mode, FightMode, AntType } from '@/simulation/types';
import { Ant, type WorldLike } from '@/simulation/Ant';
import { WorkerUpdater } from '@/simulation/WorkerUpdater';
import { SoldierUpdater } from '@/simulation/SoldierUpdater';
import { RNG } from '@/common/RNG';

export class AntUpdater {
  static readonly PAUSE_CHANCE_PER_SEC = 0.05;  // 5% chance per second
  static readonly PAUSE_DURATION_MIN = 0.1;
  static readonly PAUSE_DURATION_MAX = 0.3;

  static initialUpdate(ant: Ant, world: WorldLike, dt: number): void {
    ant.updateClocks(dt);
    ant.direction.update(dt);
    ant.addToWorldGrid(world);
  }

  static update(ant: Ant, world: WorldLike, dt: number): void {
    // Dying: just fade out
    if (ant.phase === Mode.Dying) {
      ant.updateDying(dt);
      return;
    }
    // Handle pause
    if (ant.isPaused) {
      ant.pauseTimer -= dt;
      if (ant.pauseTimer <= 0) {
        ant.isPaused = false;
      }
      return;
    }
    // Random pause
    if (RNG.proba(AntUpdater.PAUSE_CHANCE_PER_SEC * dt)) {
      ant.isPaused = true;
      ant.pauseTimer = AntUpdater.PAUSE_DURATION_MIN +
        RNG.getUnder(AntUpdater.PAUSE_DURATION_MAX - AntUpdater.PAUSE_DURATION_MIN);
      return;
    }
    // Fight if needed
    if (ant.isFighting()) {
      ant.attack(dt);
      return;
    }
    ant.updatePosition(world, dt);
    // If fight found, go for it
    if (ant.fightMode === FightMode.ToFight) {
      ant.toFightTime += dt;
      if (ant.toFightTime > ant.toFightTimeout) {
        ant.fightMode = FightMode.NoFight;
      }
      return;
    }
    // Refill if too weak
    if (ant.autonomy > 0.75 * ant.maxAutonomy) {
      ant.phase = Mode.Refill;
    }
    // Specific updates
    if (ant.type === AntType.Worker) {
      WorkerUpdater.update(ant, world, dt);
    } else {
      SoldierUpdater.update(ant, world, dt);
    }
  }
}
