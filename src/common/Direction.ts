import { dot } from '@/common/math';

export class Direction {
  angle: number;
  targetAngle: number;
  rotationSpeed: number;
  private vec: { x: number; y: number };
  private targetVec: { x: number; y: number };

  constructor(angle: number, rotationSpeed: number = 10.0) {
    this.angle = angle;
    this.targetAngle = angle;
    this.rotationSpeed = rotationSpeed;
    this.vec = { x: 0, y: 0 };
    this.targetVec = { x: 0, y: 0 };
    this.updateVec();
    this.targetVec = { ...this.vec };
  }

  private updateVec(): void {
    this.vec.x = Math.cos(this.angle);
    this.vec.y = Math.sin(this.angle);
  }

  private updateTargetVec(): void {
    this.targetVec.x = Math.cos(this.targetAngle);
    this.targetVec.y = Math.sin(this.targetAngle);
  }

  update(dt: number): void {
    this.updateVec();
    const dirNrm = { x: -this.vec.y, y: this.vec.x };
    const dirDelta = dot(this.targetVec, dirNrm);
    this.angle += this.rotationSpeed * dirDelta * dt;
  }

  getVec(): { x: number; y: number } {
    return this.vec;
  }

  addAngle(a: number): void {
    this.targetAngle += a;
    this.updateTargetVec();
  }

  setAngle(a: number): void {
    this.targetAngle = a;
    this.updateTargetVec();
  }

  addNow(a: number): void {
    this.addAngle(a);
    this.angle = this.targetAngle;
    this.updateVec();
  }

  setDirectionNow(d: { x: number; y: number }): void {
    this.targetVec = { ...d };
    this.vec = { ...d };
    this.angle = Math.atan2(d.y, d.x);
    this.targetAngle = this.angle;
  }
}
