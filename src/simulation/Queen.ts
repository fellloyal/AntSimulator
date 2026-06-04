import { PI } from '@/common/math';
import { Cooldown } from '@/common/Cooldown';
import { Mode } from '@/simulation/types';
import { Config } from '@/simulation/Config';
import type { WorldLike } from '@/simulation/Ant';

export class Queen {
  static readonly MAX_HEALTH = 100.0;
  static readonly HEAL_COOLDOWN = 5.0; // 每 5 秒自动回血
  static readonly WARNING_PHEROMONE_INTENSITY = 200.0;
  static readonly SIZE = 4.0; // 普通蚂蚁的 4 倍

  position: { x: number; y: number };
  health: number;
  colonyId: number;
  wobblePhase: number;

  // 状态
  isAlive: boolean = true;
  private healCooldown: Cooldown;
  private timeSinceLastDamage: number = 0.0;

  constructor(x: number, y: number, colonyId: number) {
    this.position = { x, y };
    this.health = Queen.MAX_HEALTH;
    this.colonyId = colonyId;
    this.wobblePhase = 0.0;
    this.healCooldown = new Cooldown(Queen.HEAL_COOLDOWN);
  }

  update(dt: number, world: WorldLike): void {
    if (!this.isAlive) return;

    this.wobblePhase += dt * 2.0;

    // 自动回血（如果一段时间没受伤）
    this.timeSinceLastDamage += dt;
    if (this.timeSinceLastDamage > 3.0 && this.healCooldown.updateAutoReset(dt)) {
      this.health = Math.min(Queen.MAX_HEALTH, this.health + 1.0);
    }

    // 释放警告信息素（如果受伤）
    if (this.health < Queen.MAX_HEALTH) {
      world.addMarker(
        this.position,
        Mode.ToEnemy,
        Queen.WARNING_PHEROMONE_INTENSITY * (1.0 - this.health / Queen.MAX_HEALTH),
        this.colonyId,
        false
      );
    }
  }

  takeDamage(amount: number, world: WorldLike): void {
    if (!this.isAlive) return;

    this.health -= amount;
    this.timeSinceLastDamage = 0.0;

    // 释放强烈警告信息素
    world.addMarker(
      this.position,
      Mode.ToEnemy,
      Queen.WARNING_PHEROMONE_INTENSITY,
      this.colonyId,
      false
    );

    if (this.health <= 0) {
      this.isAlive = false;
      this.die(world);
    }
  }

  private die(world: WorldLike): void {
    // 死亡时释放驱避剂
    for (let i = 0; i < Config.MAX_COLONIES_COUNT; i++) {
      if (i !== this.colonyId) {
        world.addMarker(
          this.position,
          Mode.ToHomeNoFood, // 用驱避剂
          50.0,
          i,
          false
        );
      }
    }
  }
}
