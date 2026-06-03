import type { Colony } from '@/simulation/Colony';
import { Mode, AntType } from '@/simulation/types';
import { Ant } from '@/simulation/Ant';

export class ColonyRenderer {
  colony: Colony;

  constructor(colony: Colony) {
    this.colony = colony;
  }

  renderAnts(ctx: CanvasRenderingContext2D): void {
    const ants = this.colony.ants;
    const color = this.colony.antsColor;

    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead) continue;

      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const isDying = ant.phase === Mode.Dying;
      const alpha = isDying
        ? Math.max(0, 1.0 - ant.dyingTimer / Ant.DYING_DURATION)
        : 1.0;

      // Wobble angle for organic movement
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + wobble;

      const px = ant.position.x;
      const py = ant.position.y;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      // Body segments (from head to abdomen)
      // Head
      const headR = 1.2 * scale;
      const headY = -3.5 * scale;
      ctx.fillStyle = isDying ? this.darkenColor(color, 0.5) : color;
      ctx.beginPath();
      ctx.ellipse(0, headY, headR, headR * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thorax
      const thoraxR = 1.4 * scale;
      const thoraxY = -1.2 * scale;
      ctx.beginPath();
      ctx.ellipse(0, thoraxY, thoraxR * 0.85, thoraxR, 0, 0, Math.PI * 2);
      ctx.fill();

      // Abdomen (gaster) - largest segment
      const abdRx = 2.2 * scale;
      const abdRy = 2.8 * scale;
      const abdY = 2.0 * scale;
      ctx.beginPath();
      ctx.ellipse(0, abdY, abdRx, abdRy, 0, 0, Math.PI * 2);
      ctx.fill();

      // Petiole (narrow waist between thorax and abdomen)
      ctx.fillStyle = isDying ? this.darkenColor(color, 0.4) : this.lightenColor(color, 0.2);
      ctx.beginPath();
      ctx.ellipse(0, 0.3 * scale, 0.6 * scale, 0.8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antennae
      const antLen = 3.0 * scale;
      const antBaseY = headY - headR * 0.5;
      const antSpread = 0.45; // radians from forward
      const antWobble1 = Math.sin(ant.wobblePhase * 1.3) * 0.15;
      const antWobble2 = Math.sin(ant.wobblePhase * 1.3 + 1.0) * 0.15;

      ctx.strokeStyle = isDying ? this.darkenColor(color, 0.3) : color;
      ctx.lineWidth = 0.5 * scale;
      ctx.lineCap = 'round';

      // Left antenna
      ctx.beginPath();
      ctx.moveTo(-headR * 0.3, antBaseY);
      ctx.lineTo(
        -Math.sin(antSpread + antWobble1) * antLen,
        antBaseY - Math.cos(antSpread + antWobble1) * antLen
      );
      ctx.stroke();

      // Right antenna
      ctx.beginPath();
      ctx.moveTo(headR * 0.3, antBaseY);
      ctx.lineTo(
        Math.sin(antSpread + antWobble2) * antLen,
        antBaseY - Math.cos(antSpread + antWobble2) * antLen
      );
      ctx.stroke();

      // Legs (3 pairs from thorax)
      const legLen = 2.5 * scale;
      const legWobble = ant.wobblePhase;
      ctx.lineWidth = 0.4 * scale;

      for (let li = 0; li < 3; li++) {
        const legBaseY = thoraxY - 0.5 * scale + li * 1.0 * scale;
        const phase = li * 2.094; // 2π/3 offset
        const swingL = Math.sin(legWobble + phase) * 0.3;
        const swingR = Math.sin(legWobble + phase + Math.PI) * 0.3;

        // Left leg
        const lAngleL = -Math.PI / 2 - 0.5 + swingL;
        const lMidX = -thoraxR * 0.7 + Math.cos(lAngleL) * legLen * 0.5;
        const lMidY = legBaseY + Math.sin(lAngleL) * legLen * 0.5;
        const lEndX = lMidX - legLen * 0.3;
        const lEndY = lMidY + legLen * 0.5;
        ctx.beginPath();
        ctx.moveTo(-thoraxR * 0.7, legBaseY);
        ctx.quadraticCurveTo(lMidX, lMidY, lEndX, lEndY);
        ctx.stroke();

        // Right leg
        const rAngleR = Math.PI / 2 + 0.5 + swingR;
        const rMidX = thoraxR * 0.7 + Math.cos(rAngleR) * legLen * 0.5;
        const rMidY = legBaseY + Math.sin(rAngleR) * legLen * 0.5;
        const rEndX = rMidX + legLen * 0.3;
        const rEndY = rMidY + legLen * 0.5;
        ctx.beginPath();
        ctx.moveTo(thoraxR * 0.7, legBaseY);
        ctx.quadraticCurveTo(rMidX, rMidY, rEndX, rEndY);
        ctx.stroke();
      }

      // Food particle if carrying
      if (ant.phase === Mode.ToHome || ant.phase === Mode.ToHomeNoFood) {
        ctx.fillStyle = '#429942';
        ctx.beginPath();
        ctx.arc(0, headY - headR - 1.0 * scale, 1.2 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.restore();
    }
  }

  renderBase(ctx: CanvasRenderingContext2D): void {
    const base = this.colony.base;
    const { x, y } = base.position;
    const radius = base.radius;

    // Mound gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
    gradient.addColorStop(0, '#3d2b1f');
    gradient.addColorStop(0.3, '#5c3d2e');
    gradient.addColorStop(0.7, '#4a3325');
    gradient.addColorStop(1, 'rgba(74,51,37,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.5, radius * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Colony color ring
    ctx.strokeStyle = this.colony.antsColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Dark entrance hole
    ctx.fillStyle = '#1a0f0a';
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 0.35, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scattered soil particles around mound
    ctx.fillStyle = '#6b4c3b';
    const seed = this.colony.id * 137;
    for (let i = 0; i < 12; i++) {
      const a = (seed + i * 0.523) % (2 * Math.PI);
      const r = radius * (0.9 + ((seed + i * 73) % 100) / 100 * 0.8);
      const dotR = 0.5 + ((seed + i * 31) % 100) / 100 * 0.8;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, dotR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Food gauge ring
    const foodRatio = base.food / base.maxFood;
    if (foodRatio > 0.01) {
      ctx.strokeStyle = '#429942';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4, -Math.PI / 2, -Math.PI / 2 + foodRatio * Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Food count text
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.floor(base.food)}`, x, y);
  }

  render(ctx: CanvasRenderingContext2D, renderAnts: boolean): void {
    if (renderAnts) this.renderAnts(ctx);
    this.renderBase(ctx);
  }

  private darkenColor(hex: string, factor: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(b * factor)})`;
  }

  private lightenColor(hex: string, factor: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.min(255, Math.floor(r + (255 - r) * factor))},${Math.min(255, Math.floor(g + (255 - g) * factor))},${Math.min(255, Math.floor(b + (255 - b) * factor))})`;
  }
}
