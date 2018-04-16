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
      if (human.isBaby()) {
        babyCount++;
      }
    }
    return babyCount;
  }

  public getElderCount(): number {
    let elderCount = 0;
    for (const human of this.population) {
      if (human.isElder()) {
        elderCount++;
      }
    }
    return elderCount;
  }

  public getFertileCount(): number {
    let fertileCount = 0;
    for (const human of this.population) {
      if (human.isFertile()) {
        fertileCount++;
      }
    }
    return fertileCount;
  }

  public growByOneYear(): void {
    for (const human of this.population) {
      human.bumpAge();
    }
  }

  public killNRandomHumans(killCount: number): void {
    for (let i = killCount; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * this.population.length);
      this.population.splice(randomIndex, 1);
    }
  }

  public buryDead(): number {
    let buriedCount = 0;
    for (let i = this.population.length - 1; i >= 0; i--) {
      if (this.population[i].isDead()) {
        const deadBody = this.population.splice(i, 1);
        buriedCount++;
      }
    }
    return buriedCount;
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
      human1.isFertile() &&
      human2.isFertile() &&
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
