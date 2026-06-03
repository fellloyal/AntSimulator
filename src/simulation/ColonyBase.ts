export class ColonyBase {
  position: { x: number; y: number };
  radius: number;
  food: number;
  maxFood: number;
  enemiesFoundCount: number;

  constructor(position: { x: number; y: number }, radius: number) {
    this.position = { ...position };
    this.radius = radius;
    this.food = 0.0;
    this.maxFood = 1000.0;
    this.enemiesFoundCount = 0;
  }

  addFood(amount: number): void {
    this.food += amount;
    this.food = Math.min(this.maxFood, this.food);
  }

  useFood(amount: number): boolean {
    if (this.food >= amount) {
      this.food -= amount;
      return true;
    }
    return false;
  }
}
