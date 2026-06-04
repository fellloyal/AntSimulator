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
    
    // 检查其他蚁群的蚁后是否被攻击
    for (let i = 0; i < colonies.length; i++) {
      if (i !== colony.id) {
        this.checkAttackOnQueen(colony, colonies[i], world);
      }
    }
  }

  /**
   * 检查蚁后攻击检测
   * 兵蚁会优先攻击敌方蚁后
   */
  private checkAttackOnQueen(attackerColony: Colony, targetColony: Colony, world: World): void {
    for (const ant of attackerColony.ants) {
      if (ant.type === AntType.Soldier && !ant.isFighting() && targetColony.queen.isAlive) {
        const dx = targetColony.queen.position.x - ant.position.x;
        const dy = targetColony.queen.position.y - ant.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const attackRange = 15.0;
        if (dist < attackRange) {
          // 兵蚁攻击蚁后
          targetColony.queen.takeDamage(ant.damage * 0.5, world);
          ant.fightMode = FightMode.Fighting;
        } else if (dist < 40.0) {
          // 兵蚁向蚁后移动
          ant.direction.angle = Math.atan2(dy, dx);
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
