import { PI } from '@/common/math';
import { RNG } from '@/common/RNG';
import { Cooldown } from '@/common/Cooldown';
import { Config } from '@/simulation/Config';
import { FightMode, AntType } from '@/simulation/types';
import { ColonyBase } from '@/simulation/ColonyBase';
import { Ant, type WorldLike } from '@/simulation/Ant';
import { AntUpdater } from '@/simulation/AntUpdater';
import { Queen } from '@/simulation/Queen';

export class Colony {
  base: ColonyBase;
  maxAntsCount: number;
  ants: Ant[];
  queen: Queen;
  antsCreationCooldown: Cooldown;
  id: number;
  antsColor: string;
  antCreationId = 0;
  colorChanged = false;
  positionChanged = false;

  constructor(x: number, y: number, maxAnts: number) {
    this.base = new ColonyBase({ x, y }, Config.COLONY_SIZE);
    this.maxAntsCount = maxAnts;
    this.ants = [];
    this.queen = new Queen(x, y, 0);
    this.antsCreationCooldown = new Cooldown(0.125);
    this.id = 0;
    this.antsColor = Config.ANT_COLOR;
  }

  initialize(colonyId: number, workerCount: number = 1000, soldierCount: number = 0): void {
    this.id = colonyId;
    this.queen = new Queen(this.base.position.x, this.base.position.y, colonyId);
    this.base.food = 0.0;
    this.antsColor = Config.COLONY_COLORS[colonyId] || '#ffffff';
    for (let i = workerCount; i-- > 0; ) {
      this.createWorker();
    }
    for (let i = soldierCount; i-- > 0; ) {
      const ant = this.createWorker();
      this.specializeSoldier(ant);
    }
  }

  setPosition(newPosition: { x: number; y: number }): void {
    this.positionChanged = true;
    this.base.position = { ...newPosition };
    for (const ant of this.ants) {
      ant.position = { ...newPosition };
    }
  }

  createWorker(): Ant {
    this.antCreationId++;
    const ant = new Ant(
      this.base.position.x,
      this.base.position.y,
      RNG.getUnder(2.0 * PI),
      this.id
    );
    ant.id = this.ants.length;
    ant.type = AntType.Worker;
    this.ants.push(ant);
    return ant;
  }

  specializeSoldier(ant: Ant): void {
    this.base.enemiesFoundCount--;
    const soldierScale = 2.0;
    ant.type = AntType.Soldier;
    ant.length *= soldierScale;
    ant.width *= soldierScale;
    ant.damage *= soldierScale * 2.0;
    ant.maxAutonomy *= soldierScale;
  }

  genericAntsUpdate(dt: number, world: WorldLike): void {
    for (const ant of this.ants) {
      AntUpdater.initialUpdate(ant, world, dt);
    }
  }

  mustCreateSoldier(): boolean {
    const soldiersCreationDiscard = 5;
    return this.base.enemiesFoundCount > 0 && this.antCreationId % soldiersCreationDiscard === 0;
  }

  isNotFull(): boolean {
    return this.ants.length < this.maxAntsCount;
  }

  createNewAnts(dt: number): void {
    const antCost = 4.0;
    if (this.antsCreationCooldown.updateAutoReset(dt) && this.isNotFull()) {
      if (this.mustCreateSoldier()) {
        if (this.base.useFood(3.0 * antCost)) {
          this.specializeSoldier(this.createWorker());
        }
      } else if (this.base.useFood(antCost)) {
        this.createWorker();
      }
    }
  }

  update(dt: number, world: WorldLike): void {
    // 更新蚁后
    this.queen.update(dt, world);
    
    // 蚁后存活才能繁殖
    if (this.queen.isAlive) {
      this.createNewAnts(dt);
    }
    
    // Update ants and check if collision with colony
    for (const ant of this.ants) {
      AntUpdater.update(ant, world, dt);
      ant.checkColony(this.base);
      
      // 兵蚁保护蚁后：检测是否有敌人靠近蚁后
      if (ant.type === AntType.Soldier) {
        this.soldierProtectsQueen(ant, world);
      }
    }
  }
  
  private soldierProtectsQueen(soldier: Ant, world: WorldLike): void {
    const dx = this.queen.position.x - soldier.position.x;
    const dy = this.queen.position.y - soldier.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // 兵蚁保持在蚁后附近巡逻
    const patrolRadius = 30.0;
    if (dist > patrolRadius) {
      const angle = Math.atan2(dy, dx);
      soldier.direction.angle = angle;
    }
    
    // 如果蚁后受伤，增加敌人发现计数，鼓励生成更多兵蚁
    if (this.queen.health < Queen.MAX_HEALTH * 0.8) {
      this.base.enemiesFoundCount += 0.1;
    }
  }

  removeDeadAnts(): void {
    this.ants = this.ants.filter((ant) => !ant.isDead());
  }

  killWeakAnts(world: WorldLike): number {
    let count = 0;
    for (const ant of this.ants) {
      if (ant.isDone()) {
        ant.kill(world);
        count++;
      }
    }
    return count;
  }

  soldiersCount(): number {
    return this.ants.filter((a) => a.type === AntType.Soldier).length;
  }

  setColor(color: string): void {
    this.antsColor = color;
    this.colorChanged = true;
  }

  stopFightsWith(colonyId: number): void {
    for (const ant of this.ants) {
      if (ant.target) {
        ant.fightMode = FightMode.NoFight;
        if (ant.target.colId === colonyId) {
          ant.target = null;
        }
      }
    }
  }

  getAntById(id: number): Ant | null {
    if (id >= 0 && id < this.ants.length) {
      return this.ants[id];
    }
    return null;
  }
}
