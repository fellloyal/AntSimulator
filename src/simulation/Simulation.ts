import { PI } from '@/common/math';
import { Config } from '@/simulation/Config';
import { Mode } from '@/simulation/types';
import { World } from '@/simulation/World';
import { Colony } from '@/simulation/Colony';
import { FightSystem } from '@/simulation/FightSystem';

export class Simulation {
  colonies: Colony[];
  world: World;
  fightSystem: FightSystem;
  paused = false;

  constructor() {
    this.world = new World(Config.WORLD_WIDTH, Config.WORLD_HEIGHT);
    this.colonies = [];
    this.fightSystem = new FightSystem();
  }

  loadMap(_filename: string): void {
    // Stub - map loading not implemented in web version
  }

  createColony(colonyX: number, colonyY: number, workerCount: number = 1000, soldierCount: number = 0): Colony {
    const colony = new Colony(colonyX, colonyY, Config.ANTS_COUNT);
    const colonyId = this.colonies.length;
    colony.initialize(colonyId, workerCount, soldierCount);
    this.colonies.push(colony);
    // Create colony markers
    this.createColonyMarkers(colony);
    return colony;
  }

  removeColony(colonyId: number): void {
    for (const colony of this.colonies) {
      colony.stopFightsWith(colonyId);
    }
    this.colonies.splice(colonyId, 1);
    this.world.clearMarkers(colonyId);
  }

  update(dt: number): void {
    if (this.paused) {
      return;
    }
    // Mark ants with no more time left as dead
    this.removeDeadAnts();
    // Update world cells (markers, density, walls)
    this.world.update(dt);
    // Handle colony position/color changes
    for (const colony of this.colonies) {
      if (colony.positionChanged) {
        this.updateColonyPosition(colony);
      }
    }
    // First perform position update and grid registration
    for (const colony of this.colonies) {
      colony.genericAntsUpdate(dt, this.world);
    }
    // Then update objectives and world sampling
    for (const colony of this.colonies) {
      colony.update(dt, this.world);
    }
    // Search for fights
    this.fightSystem.checkForFights(this.colonies, this.world);
  }

  removeDeadAnts(): void {
    // Mark old ants as dead
    for (const colony of this.colonies) {
      colony.killWeakAnts(this.world);
    }
    // Remove them
    for (const colony of this.colonies) {
      colony.removeDeadAnts();
    }
  }

  updateColonyPosition(colony: Colony): void {
    colony.positionChanged = false;
    this.world.clearMarkers(colony.id);
    this.createColonyMarkers(colony);
  }

  createColonyMarkers(colony: Colony): void {
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64.0) * (2.0 * PI);
      const pos = {
        x: colony.base.position.x + 0.9 * colony.base.radius * Math.cos(angle),
        y: colony.base.position.y + 0.9 * colony.base.radius * Math.sin(angle),
      };
      this.world.addMarker(pos, Mode.ToHome, 10.0, colony.id, true);
    }
  }
}
