import { generator } from "./generator";

export class Human {
  public vigor: number;
  public lifespan: number;
  public age: number = 0;

  private static readonly baseVigor: number = 50; // %
  private static readonly maxAge: number = 120;
  private static readonly reproductionAge: number = 15;

  public constructor(inheritedVigor: number = Human.baseVigor) {
    this.vigor = this.generateVigor(inheritedVigor);
    this.lifespan = this.generateLifespan();
  }

  public bumpAge(): void {
    this.age++;
  }

  public isDead(): boolean {
    return this.age >= this.lifespan;
  }

  public isAdult(): boolean {
    return this.age >= Human.reproductionAge;
  }

  // returns non-negative number
  private generateVigor(inheritedVigor: number): number {
    const geneticVigor = (inheritedVigor + Human.baseVigor) / 2;
    const mutation = generator.getRandomNumber(-10, 10);
    const mutatedVigor = Math.round(geneticVigor + mutation);
    if (mutatedVigor >= 0) {
      return mutatedVigor;
    } else {
      return 0;
    }
  }

  private generateLifespan(): number {
    return Math.floor(
      generator.getRandomNumber(0, Human.maxAge) * (this.vigor / 100)
    );
  }
}
