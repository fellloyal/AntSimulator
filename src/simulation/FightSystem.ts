import { FightMode, AntType } from '@/simulation/types';
import type { Ant } from '@/simulation/Ant';
import type { Colony } from '@/simulation/Colony';
import type { World } from '@/simulation/World';

export class FightSystem {
  checkForFights(colonies: Colony[], world: World): void {
    for (const colony of colonies) {
      this.checkForFightsInColony(colony, colonies, world);
    }
  }

  private checkForFightsInColony(colony: Colony, colonies: Colony[], world: World): void {
    for (const ant of colony.ants) {
      // Check if the ant has an active fight request from markers sampling
      if (ant.fightRequest.active) {
        const colId = ant.fightRequest.colId;
        const antId = ant.fightRequest.antId;
        if (colId < colonies.length) {
          const otherAnt = colonies[colId].getAntById(antId);
          if (otherAnt) {
            ant.setTarget(otherAnt);
          }
        }
      }
      // Check only for non already fighting ants
      else if (!ant.isFighting()) {
        this.checkForFight(ant, colonies, world);
      }
      // Check that the target is also in fight
      else if (ant.target) {
        if (!ant.target.isFighting()) {
          ant.target.setTarget(ant);
        }
      }
    }
  }

  private checkForFight(ant: Ant, colonies: Colony[], world: World): void {
    // Only soldiers can initiate fights (workers with NoFight won't)
    if (ant.type === AntType.Worker && ant.fightMode === FightMode.NoFight) {
      return;
    }
    // Check for potential enemies
    const currentCell = world.map.get(ant.position);
    for (let i = colonies.length; i-- > 0; ) {
      if (i !== ant.colId) {
        const antId = currentCell.markers[i].currentAnt;
        if (antId > -1) {
          const other = colonies[i].getAntById(antId);
          if (other) {
            ant.setTarget(other);
            other.setTarget(ant);
            return;
          }
        }
      }
    }
  }
}
