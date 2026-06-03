import { FightMode, AntType } from '@/simulation/types';
import type { Ant } from '@/simulation/Ant';
import type { Colony } from '@/simulation/Colony';
import type { World } from '@/simulation/World';

export class FightSystem {
  private frameCounter = 0;
  private static readonly CHECK_INTERVAL = 3; // Check fights every N frames

  checkForFights(colonies: Colony[], world: World): void {
    this.frameCounter++;
    // Only do full fight scanning every CHECK_INTERVAL frames
    if (this.frameCounter % FightSystem.CHECK_INTERVAL === 0) {
      for (const colony of colonies) {
        this.checkForFightsInColony(colony, colonies, world);
      }
    } else {
      // On non-scan frames, only process pending fight requests
      for (const colony of colonies) {
        this.processFightRequests(colony, colonies);
      }
    }
  }

  private processFightRequests(colony: Colony, colonies: Colony[]): void {
    for (const ant of colony.ants) {
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
      // Ensure mutual fight binding
      if (ant.isFighting() && ant.target && !ant.target.isFighting()) {
        ant.target.setTarget(ant);
      }
    }
  }

  private checkForFightsInColony(colony: Colony, colonies: Colony[], world: World): void {
    for (const ant of colony.ants) {
      // Process fight requests from marker sampling
      if (ant.fightRequest.active) {
        const colId = ant.fightRequest.colId;
        const antId = ant.fightRequest.antId;
        if (colId < colonies.length) {
          const otherAnt = colonies[colId].getAntById(antId);
          if (otherAnt) {
            ant.setTarget(otherAnt);
          }
        }
        continue;
      }
      // Skip ants already in fight
      if (ant.isFighting()) {
        // Ensure mutual fight binding
        if (ant.target && !ant.target.isFighting()) {
          ant.target.setTarget(ant);
        }
        continue;
      }
      // Only soldiers and workers with ToFight mode initiate fights
      if (ant.type === AntType.Worker && ant.fightMode === FightMode.NoFight) {
        continue;
      }
      this.checkForFight(ant, colonies, world);
    }
  }

  private checkForFight(ant: Ant, colonies: Colony[], world: World): void {
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
