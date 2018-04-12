import { generator } from "./generator";

export class Human {
  public mortality: number;
  public lifespan: number;
  public age: number = 0;

  private static readonly baseMortality: number = 0.5;
  private static readonly maxAge: number = 120;
  private static readonly reproductionAge: number = 15;

  public constructor(inheritedMortality: number = Human.baseMortality) {
    this.mortality = this.generateMortality(inheritedMortality);
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
  private generateMortality(inheritedMortality: number): number {
    const inherited = (inheritedMortality + Human.baseMortality) / 2;
    const mutation = generator.getRandomNumber(-1, 1) / 10;
    const mutatedMortality = inherited + mutation;
    if (mutatedMortality >= 0) {
      return parseFloat(mutatedMortality.toFixed(2));
    } else {
      return 0;
    }
  }

  private generateLifespan(): number {
    return Math.floor(
      generator.getRandomNumber(0, Human.maxAge) * this.mortality
    );
  }
}
