import { Human } from "./human";
import { generator } from "./generator";

interface IAgeGroupsCount {
  baby: number;
  adult: number;
  elder: number;
}

export class Humans {
  private population: Human[] = [];

  public constructor(initialPopulation: number) {
    this.generateInitialPopulation(initialPopulation);
  }

  public getTotalCount(): number {
    return this.population.length;
  }

  public getAgeGroupsCount(): IAgeGroupsCount {
    const ageGroupsCount = {
      baby: 0,
      adult: 0,
      elder: 0
    };
    for (const human of this.population) {
      if (human.ageGroup === Human.ageGroups.Baby) {
        ageGroupsCount.baby++;
      } else if (human.ageGroup === Human.ageGroups.Adult) {
        ageGroupsCount.adult++;
      } else if (human.ageGroup === Human.ageGroups.Elder) {
        ageGroupsCount.elder++;
      }
    }
    return ageGroupsCount;
  }

  public getTotalAverageVitality(): number {
    if (this.population.length === 0) {
      return 0;
    } else {
      let totalVitalitySum = 0;
      for (const human of this.population) {
        totalVitalitySum += human.vitality;
      }
      return Math.round(totalVitalitySum / this.population.length);
    }
  }

  public growByOneYear(): void {
    for (const human of this.population) {
      human.bumpAge();
    }
  }

  public killRandomHumans(killCount: number): void {
    for (let i = killCount; i >= 0; i--) {
      const populationLength = this.population.length;
      const randomIndex = Math.floor(Math.random() * populationLength);
      this.population[randomIndex] = this.population[populationLength - 1];
      this.population.pop();
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
        if (this.isLoveFruitful(human, mate)) {
          const baby = new Human(human, mate);
          this.population.push(baby);
          bornCount++;
        }
      }
    }
    return bornCount;
  }

  private isLoveFruitful(human1: Human, human2: Human): boolean {
    if (
      human1.ageGroup === Human.ageGroups.Adult &&
      human2.ageGroup === Human.ageGroups.Adult
    ) {
      const loveChance = Human.calculateLoveChance(human1, human2);
      return (
        loveChance >= generator.getRandomPercent() &&
        Human.pregnancyChance >= generator.getRandomPercent()
      );
    } else {
      return false;
    }
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