import type { Colony } from '@/simulation/Colony';
import { Mode, AntType } from '@/simulation/types';
import { Ant } from '@/simulation/Ant';

// LOD thresholds based on viewport zoom
const LOD_DETAIL = 1.5;
const LOD_SIMPLE = 0.6;

// UI美化（task 16）：蚂蚁群聚可辨识性增强
// 整体尺寸缩 0.7x（让群体中草地透出），加 0.5px 暗色描边（单只边界清晰）
const ANT_SCALE = 0.7;
const STROKE_COLOR = '#1a0808';
const STROKE_WIDTH_DETAIL = 0.5;
const STROKE_WIDTH_MEDIUM = 0.3;

export class ColonyRenderer {
  colony: Colony;

  constructor(colony: Colony) {
    this.colony = colony;
  }

  renderAnts(ctx: CanvasRenderingContext2D, zoom: number): void {
    const ants = this.colony.ants;
    const color = this.colony.antsColor;

    const cr = parseInt(color.slice(1, 3), 16);
    const cg = parseInt(color.slice(3, 5), 16);
    const cb = parseInt(color.slice(5, 7), 16);
    const colorLight = `rgb(${Math.min(255, cr + ((255 - cr) >> 2))},${Math.min(255, cg + ((255 - cg) >> 2))},${Math.min(255, cb + ((255 - cb) >> 2))})`;

    if (zoom >= LOD_DETAIL) {
      this.renderAntsDetailed(ctx, ants, color, colorLight, cr, cg, cb);
    } else if (zoom >= LOD_SIMPLE) {
      this.renderAntsMedium(ctx, ants, color, cr, cg, cb);
    } else {
      this.renderAntsSimple(ctx, ants, color);
    }
  }

  // LOD 0: Simple line segments - fastest
  private renderAntsSimple(ctx: CanvasRenderingContext2D, ants: Ant[], color: string): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const h = 4 * scale;
      const angle = ant.direction.angle + Math.PI / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = cos * h * 0.5;
      const dy = sin * h * 0.5;
      const px = ant.position.x;
      const py = ant.position.y;
      ctx.moveTo(px - dx, py - dy);
      ctx.lineTo(px + dx, py + dy);
    }
    ctx.stroke();
  }

  // LOD 1: Ovals - medium quality, no save/restore
  private renderAntsMedium(
    ctx: CanvasRenderingContext2D, ants: Ant[], color: string,
    cr: number, cg: number, cb: number
  ): void {
    // Alive ants body batch
    ctx.fillStyle = color;
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dying || ant.phase === Mode.Dead) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      const px = ant.position.x;
      const py = ant.position.y;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // UI美化（task 16）：中LOD身体暗色描边
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = STROKE_WIDTH_MEDIUM;
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dying || ant.phase === Mode.Dead) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      const px = ant.position.x;
      const py = ant.position.y;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Food dots
    ctx.fillStyle = '#429942';
    ctx.beginPath();
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase !== Mode.ToHome && ant.phase !== Mode.ToHomeNoFood) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      const px = ant.position.x;
      const py = ant.position.y;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.moveTo(1.2 * scale, -5.5 * scale);
      ctx.arc(0, -5.5 * scale, 1.2 * scale, 0, Math.PI * 2);
      ctx.restore();
    }
    ctx.fill();

    // Dying ants
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase !== Mode.Dying) continue;
      const alpha = Math.max(0, 1.0 - ant.dyingTimer / Ant.DYING_DURATION);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${cr >> 1},${cg >> 1},${cb >> 1})`;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const angle = ant.direction.angle + Math.PI / 2;
      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.6 * scale, 3 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
  }

  // LOD 2: Full detail with legs and antennae
  private renderAntsDetailed(
    ctx: CanvasRenderingContext2D, ants: Ant[],
    color: string, colorLight: string,
    cr: number, cg: number, cb: number
  ): void {
    // Batch 1: Body segments
    ctx.fillStyle = color;
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead || ant.phase === Mode.Dying) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      // Petiole
      ctx.fillStyle = colorLight;
      ctx.beginPath();
      ctx.ellipse(0, 0.3 * scale, 0.6 * scale, 0.8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.restore();
    }

    // UI美化（task 16）：高LOD身体暗色描边
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = STROKE_WIDTH_DETAIL;
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead || ant.phase === Mode.Dying) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Batch 2: Antennae
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead || ant.phase === Mode.Dying) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      const antWobble1 = Math.sin(ant.wobblePhase * 1.3) * 0.15;
      const antWobble2 = Math.sin(ant.wobblePhase * 1.3 + 1.0) * 0.15;
      const headR = 1.2 * scale;
      const headY = -3.5 * scale;
      const antLen = 3.0 * scale;
      const antBaseY = headY - headR * 0.5;
      const antSpread = 0.45;

      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);
      ctx.moveTo(-headR * 0.3, antBaseY);
      ctx.lineTo(
        -Math.sin(antSpread + antWobble1) * antLen,
        antBaseY - Math.cos(antSpread + antWobble1) * antLen
      );
      ctx.moveTo(headR * 0.3, antBaseY);
      ctx.lineTo(
        Math.sin(antSpread + antWobble2) * antLen,
        antBaseY - Math.cos(antSpread + antWobble2) * antLen
      );
      ctx.restore();
    }
    ctx.stroke();

    // Batch 3: Legs
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase === Mode.Dead || ant.phase === Mode.Dying) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      const thoraxR = 1.4 * scale;
      const thoraxY = -1.2 * scale;
      const legLen = 2.5 * scale;
      const legWobble = ant.wobblePhase;

      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);

      for (let li = 0; li < 3; li++) {
        const legBaseY = thoraxY - 0.3 * scale + li * 0.9 * scale;
        const phase = li * 2.094;
        const swingL = Math.sin(legWobble + phase) * 0.25;
        const swingR = Math.sin(legWobble + phase + Math.PI) * 0.25;

        const lStartX = -thoraxR * 0.7;
        const lMidX = lStartX - legLen * 0.5;
        const lMidY = legBaseY + legLen * 0.15 + swingL * legLen;
        const lEndX = lMidX - legLen * 0.15;
        const lEndY = lMidY + legLen * 0.35;
        ctx.moveTo(lStartX, legBaseY);
        ctx.quadraticCurveTo(lMidX, lMidY, lEndX, lEndY);

        const rStartX = thoraxR * 0.7;
        const rMidX = rStartX + legLen * 0.5;
        const rMidY = legBaseY + legLen * 0.15 + swingR * legLen;
        const rEndX = rMidX + legLen * 0.15;
        const rEndY = rMidY + legLen * 0.35;
        ctx.moveTo(rStartX, legBaseY);
        ctx.quadraticCurveTo(rMidX, rMidY, rEndX, rEndY);
      }
      ctx.restore();
    }
    ctx.stroke();

    // Batch 4: Food particles
    ctx.fillStyle = '#429942';
    ctx.beginPath();
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase !== Mode.ToHome && ant.phase !== Mode.ToHomeNoFood) continue;
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const wobble = Math.sin(ant.wobblePhase) * 0.05;
      const angle = ant.direction.angle + Math.PI / 2 + wobble;
      const headR = 1.2 * scale;
      const headY = -3.5 * scale;
      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);
      ctx.moveTo(1.2 * scale, headY - headR - 1.0 * scale);
      ctx.arc(0, headY - headR - 1.0 * scale, 1.2 * scale, 0, Math.PI * 2);
      ctx.restore();
    }
    ctx.fill();

    // Batch 5: Dying ants
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      if (ant.phase !== Mode.Dying) continue;
      const alpha = Math.max(0, 1.0 - ant.dyingTimer / Ant.DYING_DURATION);
      const scale = (ant.type === AntType.Soldier ? 2.0 : 1.0) * ANT_SCALE;
      const angle = ant.direction.angle + Math.PI / 2;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${cr >> 1},${cg >> 1},${cb >> 1})`;
      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
  }

  renderBase(ctx: CanvasRenderingContext2D): void {
    const base = this.colony.base;
    const { x, y } = base.position;
    const radius = base.radius;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
    gradient.addColorStop(0, '#3d2b1f');
    gradient.addColorStop(0.3, '#5c3d2e');
    gradient.addColorStop(0.7, '#4a3325');
    gradient.addColorStop(1, 'rgba(74,51,37,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.5, radius * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.colony.antsColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = '#1a0f0a';
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 0.35, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

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

    // UI美化：蚁群色脉冲光晕（task 15）
    ctx.strokeStyle = this.colony.antsColor;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // UI美化：顶部小草（3 株，伪随机角度）
    ctx.strokeStyle = '#3a5a20';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const angle = (seed + i * 2.094) % (2 * Math.PI);
      const gr = radius * 0.85;
      const gx = x + Math.cos(angle) * gr;
      const gy = y + Math.sin(angle) * gr * 0.5;
      const grassH = 4 + ((seed + i * 31) % 100) / 25;
      ctx.beginPath();
      ctx.moveTo(gx - 1, gy);
      ctx.quadraticCurveTo(gx, gy - grassH * 0.6, gx + 0.5, gy - grassH);
      ctx.stroke();
    }

    // UI美化：周围 3 只装饰蚂蚁
    ctx.fillStyle = this.colony.antsColor;
    for (let i = 0; i < 3; i++) {
      const angle = (seed + i * 1.7 + 0.5) % (2 * Math.PI);
      const ar = radius * (0.9 + ((seed + i * 23) % 100) / 500);
      const ax = x + Math.cos(angle) * ar;
      const ay = y + Math.sin(angle) * ar * 0.7;
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.5, 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // UI美化：4 个方向的蚁道痕迹
    ctx.strokeStyle = '#5a4020';
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 4; i++) {
      const angle = (seed + i * 1.57) % (2 * Math.PI);
      const sx2 = x + Math.cos(angle) * radius * 0.6;
      const sy2 = y + Math.sin(angle) * radius * 0.5;
      const ex = x + Math.cos(angle) * radius * 1.6;
      const ey = y + Math.sin(angle) * radius * 1.3;
      ctx.beginPath();
      ctx.moveTo(sx2, sy2);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

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

    ctx.fillStyle = '#e0e0e0';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.floor(base.food)}`, x, y);
  }

  render(ctx: CanvasRenderingContext2D, renderAnts: boolean, zoom: number): void {
    if (renderAnts) this.renderAnts(ctx, zoom);
    this.renderBase(ctx);
  }
}
