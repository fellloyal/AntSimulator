export class Cooldown {
  value: number;
  target: number;

  constructor(target: number, value?: number) {
    this.target = target;
    this.value = value !== undefined ? value : 0.0;
  }

  update(dt: number): boolean {
    this.value += dt;
    return this.ready();
  }

  updateAutoReset(dt: number): boolean {
    this.update(dt);
    const res = this.ready();
    if (res) {
      this.reset();
    }
    return res;
  }

  ready(): boolean {
    return this.value >= this.target;
  }

  reset(): void {
    this.value = 0.0;
  }

  getRatio(): number {
    return this.value / this.target;
  }
}
