import { generator } from "./generator";

enum HumanAgeGroup {
  Baby = 0,
  Adult = 1,
  Elder = 2
}

export class Human {
  public static readonly ageGroups = HumanAgeGroup;
  // https://menstrual-cycle-calculator.com/chance-pregnant-unprotected-sex/
  public static readonly pregnancyChance: number = 30; // %
  // https://en.wikipedia.org/wiki/List_of_the_verified_oldest_people
  public static readonly maxAge: number = 122;
  // https://en.wikipedia.org/wiki/Age_and_female_fertility
  public static readonly pubertyAge: number = 12;
  // https://en.wikipedia.org/wiki/Pregnancy_over_age_50
  public static readonly menopauseAge: number = 72;
  // we base on Classical Rome period: https://en.wikipedia.org/wiki/Life_expectancy
  private static readonly baseVitality: number = 47; // %
  private static readonly similarityLoveFactor: number = 10; // %

  public vitality: number = Human.baseVitality;
  public lifespan: number = 1;
  public age: number = 0;
  public ageGroup: HumanAgeGroup = Human.ageGroups.Baby;
  public isAlive: boolean = true;

  public constructor(parent1?: Human, parent2?: Human) {
    Human.generateVitality(this, parent1, parent2);
    // lifespan uses vitality, so should be called last
    Human.generateLifespan(this);
  }

  public bumpAge(): void {
    this.age++;
    this.isAlive = this.age < this.lifespan;
    if (this.age < Human.pubertyAge) {
      this.ageGroup = Human.ageGroups.Baby;
    } else if (this.age >= Human.menopauseAge) {
      this.ageGroup = Human.ageGroups.Elder;
    } else {
      this.ageGroup = Human.ageGroups.Adult;
    }
  }

  public static calculateLoveChance(human1: Human, human2: Human): number {
    const averageVitality = Human.calculateAverageVitality(human1, human2);
    if (
      Math.abs(human1.vitality - human2.vitality) >= Human.similarityLoveFactor
    ) {
      return averageVitality - Human.similarityLoveFactor;
    } else {
      return averageVitality + Human.similarityLoveFactor;
    }
  }

  private static calculateAverageVitality(
    human1: Human,
    human2: Human
  ): number {
    return (human1.vitality + human2.vitality) / 2;
  }

  // sets non-negative number
  private static generateVitality(
    human: Human,
    parent1?: Human,
    parent2?: Human
  ): void {
    let geneticVitality = Human.baseVitality;
    if (parent1 instanceof Human && parent2 instanceof Human) {
      const parentsVitality = Human.calculateAverageVitality(parent1, parent2);
      geneticVitality = (Human.baseVitality + parentsVitality) / 2;
    }
    const mutation = generator.getRandomNumber(-20, 20);
    human.vitality = Math.max(0, Math.round(geneticVitality + mutation));
  }

  private static generateLifespan(human: Human): void {
    human.lifespan = Math.floor(
      generator.getRandomNumber(0, Human.maxAge) * (human.vitality / 100)
    );
    // check if not born dead
    human.isAlive = human.age < human.lifespan;
  }
}
