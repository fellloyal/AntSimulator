import type { Colony } from '@/simulation/Colony';
import { Mode, AntType } from '@/simulation/types';

export class ColonyRenderer {
  colony: Colony;

  constructor(colony: Colony) {
    this.colony = colony;
  }

  renderAnts(ctx: CanvasRenderingContext2D): void {
    const ants = this.colony.ants;
    const color = this.colony.antsColor;

    ctx.fillStyle = color;

    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead) continue;

      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const w = 3.0 * scale;
      const l = 4.7 * scale;

      const dirVec = ant.direction.getVec();
      const dirX = dirVec.x;
      const dirY = dirVec.y;
      const sizeRatio = w / l;

      // Direction vector * length
      const dirVecX = dirX * l;
      const dirVecY = dirY * l;
      // Normal vector (perpendicular, scaled by sizeRatio)
      const nrmX = -dirVecY * sizeRatio;
      const nrmY = dirVecX * sizeRatio;

      const px = ant.position.x;
      const py = ant.position.y;

      // Draw ant as a rotated quad
      ctx.beginPath();
      ctx.moveTo(px - nrmX + dirVecX, py - nrmY + dirVecY);
      ctx.lineTo(px + nrmX + dirVecX, py + nrmY + dirVecY);
      ctx.lineTo(px + nrmX - dirVecX, py + nrmY - dirVecY);
      ctx.lineTo(px - nrmX - dirVecX, py - nrmY - dirVecY);
      ctx.closePath();
      ctx.fill();

      // Draw food dot if carrying food
      if (ant.phase === Mode.ToHome || ant.phase === Mode.ToHomeNoFood) {
        const foodX = px + l * 0.65 * dirX;
        const foodY = py + l * 0.65 * dirY;
        ctx.save();
        ctx.fillStyle = '#429942';
        ctx.beginPath();
        ctx.arc(foodX, foodY, 2.0 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  renderBase(ctx: CanvasRenderingContext2D): void {
    const base = this.colony.base;
    const { x, y } = base.position;
    const radius = base.radius;

    // Draw colony base circle
    ctx.fillStyle = this.colony.antsColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw food gauge ring
    const foodRatio = base.food / base.maxFood;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, -Math.PI / 2, -Math.PI / 2 + foodRatio * Math.PI * 2);
    ctx.stroke();

    // Draw food count text
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.floor(base.food)}`, x, y);
  }

  render(ctx: CanvasRenderingContext2D, renderAnts: boolean): void {
    if (renderAnts) this.renderAnts(ctx);
    this.renderBase(ctx);
  }
}
