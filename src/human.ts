import { generator } from "./generator";

export class Human {
  // https://menstrual-cycle-calculator.com/chance-pregnant-unprotected-sex/
  public static readonly pregnancyChance: number = 30 / 100;
  // based on Paleolithic https://en.wikipedia.org/wiki/Life_expectancy
  public static readonly maxAge: number = 54;
  // https://en.wikipedia.org/wiki/Age_and_female_fertility
  public static readonly pubertyAge: number = 12;
  // https://en.wikipedia.org/wiki/Pregnancy_over_age_50
  public static readonly menopauseAge: number = 72;
  // The Framingham Heart Study https://www.sharecare.com/health/longevity/how-parents-lifespan-affect-lifespan
  private static readonly lifespanInheritance: number = 6 / 100;
  // https://revisesociology.com/2017/11/07/how-many-people-single/
  private static readonly inRelationshipChance: number = 61 / 100;

  public age: number = 0;
  public isAdult: boolean = false;
  public isAlive: boolean = true;
  public name: string;
  public lifespan: number;

  public constructor(parent1?: Human, parent2?: Human) {
    this.name = generator.getUniqueName();
    this.lifespan = this.generateLifespan(parent1, parent2);
    // check if not born dead
    this.checkIfAlive();
  }

  // increments the age by 1, checks if didn't die of old age and assigns to proper age group
  public bumpAge(): void {
    this.age++;
    this.isAdult = this.age >= Human.pubertyAge;
    this.checkIfAlive();
  }

  // generates lifespan based on random things and parents
  private generateLifespan(parent1?: Human, parent2?: Human): number {
    const randomLifespan = generator.getRandomNumber(0, Human.maxAge);
    if (randomLifespan === 0) {
      return 0;
    } else if (parent1 instanceof Human && parent2 instanceof Human) {
      return Math.floor(
        Human.lifespanInheritance *
          ((parent1.lifespan + parent2.lifespan) / 2) +
          (1 - Human.lifespanInheritance) * randomLifespan
      );
    } else {
      return randomLifespan;
    }
  }

  private checkIfAlive(): void {
    this.isAlive = this.age < this.lifespan;
  }

  // returns a % chance two given humans will fall in love and make a baby
  public static getBabyChance(human1: Human, human2: Human): number {
    if (human1.isAdult && human2.isAdult) {
      return 100 * (Human.pregnancyChance * Human.inRelationshipChance);
    } else {
      return 0;
    }
  }
}
