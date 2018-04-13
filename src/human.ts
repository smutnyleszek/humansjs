import { generator } from "./generator";

export class Human {
  // https://menstrual-cycle-calculator.com/chance-pregnant-unprotected-sex/
  public static readonly pregnancyChance: number = 30; // %

  public vigor: number;
  public lifespan: number;
  public age: number = 0;

  private static readonly baseVigor: number = 50; // %
  // https://en.wikipedia.org/wiki/List_of_the_verified_oldest_people
  private static readonly maxAge: number = 122;
  // https://en.wikipedia.org/wiki/Age_and_female_fertility
  private static readonly reproductionAgeMin: number = 12;
  // https://en.wikipedia.org/wiki/Pregnancy_over_age_50
  private static readonly reproductionAgeMax: number = 72;

  public constructor(parent1?: Human, parent2?: Human) {
    let inheritedVigor = Human.baseVigor;
    if (parent1 instanceof Human && parent2 instanceof Human) {
      inheritedVigor = Human.calculateAverageVigor(parent1, parent2);
    }

    this.vigor = this.generateVigor(inheritedVigor);
    this.lifespan = this.generateLifespan();
  }

  public bumpAge(): void {
    this.age++;
  }

  public isDead(): boolean {
    return this.age >= this.lifespan;
  }

  public isBaby(): boolean {
    return this.age < Human.reproductionAgeMin;
  }

  public isElder(): boolean {
    return this.age > Human.reproductionAgeMax;
  }

  public isFertile(): boolean {
    return !this.isBaby() && !this.isElder();
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

  public static calculateAverageVigor(human1: Human, human2: Human): number {
    return (human1.vigor + human2.vigor) / 2;
  }
}
