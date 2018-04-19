import { Human } from "./human";
import { generator } from "./generator";

export class Humans {
  private population: Human[] = [];

  public constructor(initialPopulation: number) {
    this.generateInitialPopulation(initialPopulation);
  }

  public getTotalCount(): number {
    return this.population.length;
  }

  public getBabyCount(): number {
    let babyCount = 0;
    for (const human of this.population) {
      if (human.ageGroup === Human.ageGroups.Baby) {
        babyCount++;
      }
    }
    return babyCount;
  }

  public getElderCount(): number {
    let elderCount = 0;
    for (const human of this.population) {
      if (human.ageGroup === Human.ageGroups.Elder) {
        elderCount++;
      }
    }
    return elderCount;
  }

  public getAdultCount(): number {
    let adultCount = 0;
    for (const human of this.population) {
      if (human.ageGroup === Human.ageGroups.Adult) {
        adultCount++;
      }
    }
    return adultCount;
  }

  public growByOneYear(): void {
    for (const human of this.population) {
      human.bumpAge();
    }
  }

  public killRandomHumans(killCount: number): void {
    for (let i = killCount; i >= 0; i--) {
      this.population.splice(
        Math.floor(Math.random() * this.population.length),
        1
      );
    }
  }

  public buryDead(): number {
    const populationCountBefore = this.population.length;
    // keep only alive people in population
    this.population = this.population.filter((human: Human): boolean => {
      return human.isAlive;
    });
    return populationCountBefore - this.population.length;
  }

  public makeLove(): number {
    let bornCount = 0;

    if (this.population.length <= 1) {
      return bornCount;
    } else {
      for (let i = this.population.length - 1; i >= 0; i--) {
        const human = this.population[i];
        const mate = this.getRandomHuman();
        if (this.isLovePossibleAndSuccessful(human, mate)) {
          const baby = new Human(human, mate);
          this.population.push(baby);
          bornCount++;
        }
      }
    }
    return bornCount;
  }

  private isLovePossibleAndSuccessful(human1: Human, human2: Human): boolean {
    const loveChance = Human.calculateAverageVigor(human1, human2);
    return (
      human1.ageGroup === Human.ageGroups.Adult &&
      human2.ageGroup === Human.ageGroups.Adult &&
      loveChance >= generator.getRandomPercent() &&
      Human.pregnancyChance >= generator.getRandomPercent()
    );
  }

  private generateInitialPopulation(initialPopulation: number): void {
    for (let i = 0; i < initialPopulation; i++) {
      this.population.push(new Human());
    }
  }

  private getRandomHuman(): Human {
    return this.population[
      generator.getRandomNumber(0, this.population.length - 1)
    ];
  }
}
