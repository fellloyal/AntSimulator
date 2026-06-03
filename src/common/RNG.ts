export class RNG {
  static getUnder(max: number): number {
    return Math.random() * max;
  }

  static getRange(width: number): number {
    return -width * 0.5 + Math.random() * width;
  }

  static getFullRange(width: number): number {
    return RNG.getRange(2.0 * width);
  }

  static getUnder1(): number {
    return Math.random();
  }

  static proba(threshold: number): boolean {
    return Math.random() < threshold;
  }
}
