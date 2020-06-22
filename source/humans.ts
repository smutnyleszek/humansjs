import { generator } from "./generator";
import { Human } from "./human";

export class Humans {
  private population: Human[] = [];

  public constructor(initialPopulation: number) {
    this.generateInitialPopulation(initialPopulation);
  }

  public getTotalCount(): number {
    return this.population.length;
  }

  public growByOneYear(): void {
    for (const human of this.population) {
      human.bumpAge();
    }
  }

  // immediately removes X random humans from the population
  public killRandomHumans(killCount: number): void {
    if (killCount >= this.getTotalCount()) {
      // wipe whole population
      this.population = [];
    } else {
      for (let i = killCount; i >= 0; i--) {
        this.population[this.getRandomIndex()] = this.population[
          this.population.length - 1
        ];
        this.population.pop();
      }
    }
  }

  // removes humans that died from old age from the population
  // returns the number of removed humans
  public buryDead(): number {
    const populationCountBefore = this.getTotalCount();
    // keep only alive people in population
    this.population = this.population.filter((human: Human): boolean => {
      return human.isAlive;
    });
    return populationCountBefore - this.getTotalCount();
  }

  // finds a random mate for each human and if matched
  // will create a new baby human
  // returns the number of born humans
  public makeLove(): number {
    let bornCount = 0;

    if (this.getTotalCount() <= 1) {
      // one human can't make babies
      return bornCount;
    } else {
      for (let i = this.population.length - 1; i >= 0; i--) {
        const human = this.population[i];
        // get other random human
        const mate = this.getRandomHuman(i);
        if (this.isLoveFruitful(human, mate)) {
          const baby = new Human(human, mate);
          this.population.push(baby);
          bornCount++;
        }
      }
    }
    return bornCount;
  }

  public getHuman(index: number): Human {
    return this.population[index];
  }

  // returns a random human, potentially other than given index
  public getRandomHuman(otherThan?: number): Human {
    let index = this.getRandomIndex();
    while (index === otherThan) {
      index = this.getRandomIndex();
    }
    return this.population[index];
  }

  private getRandomIndex(): number {
    return generator.getRandomNumber(0, this.population.length - 1);
  }

  // checks if two humans are able to love each other and able to get pregnant
  private isLoveFruitful(human1: Human, human2: Human): boolean {
    return Human.getBabyChance(human1, human2) > generator.getRandomPercent();
  }

  private generateInitialPopulation(initialPopulation: number): void {
    for (let i = 0; i < initialPopulation; i++) {
      this.population.push(new Human());
    }
  }
}
