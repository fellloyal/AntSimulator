import { Mode, FightMode, AntType } from '@/simulation/types';
import { Ant, type WorldLike } from '@/simulation/Ant';
import { WorkerUpdater } from '@/simulation/WorkerUpdater';
import { SoldierUpdater } from '@/simulation/SoldierUpdater';

export class AntUpdater {
  static initialUpdate(ant: Ant, world: WorldLike, dt: number): void {
    ant.updateClocks(dt);
    ant.direction.update(dt);
    ant.addToWorldGrid(world);
  }

  static update(ant: Ant, world: WorldLike, dt: number): void {
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
