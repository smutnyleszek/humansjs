import { logger } from "./logger";
import { Human } from "./human";
import { generator } from "./generator";

declare global {
  interface String {
    padEnd(maxLength: number, fillString?: string): string;
  }
}

interface ICatastrophe {
  type: string;
  killPercentage: number;
}

class HumanExistence {
  // https://en.wikipedia.org/wiki/Minimum_viable_population
  private static readonly initialPopulation: number = 4129;
  private static readonly targetPopulation: number = 100000;
  private static readonly yearTime: number = 0.2 * 1000; // seconds

  private static readonly catastrophes: ICatastrophe[] = [
    { type: "🤢", killPercentage: 40 },
    { type: "☄️", killPercentage: 35 },
    { type: "🌋", killPercentage: 30 },
    { type: "🌊", killPercentage: 25 },
    { type: "❄️", killPercentage: 20 },
    { type: "🏜", killPercentage: 10 },
    { type: "🌪", killPercentage: 5 }
  ];

  private humans: Human[] = [];
  private lifeIntervalId: number = 0;
  private currentYear: number = 0;

  public constructor() {
    this.generateInitialPopulation();
    this.startLife();
  }

  private generateInitialPopulation(): void {
    for (let i = 0; i < HumanExistence.initialPopulation; i++) {
      this.humans.push(new Human());
    }
    logger.log(`Unknown force created ${this.humans.length} humans.`);
  }

  private startLife(): void {
    this.lifeIntervalId = window.setInterval(
      this.simulateOneYear.bind(this),
      HumanExistence.yearTime
    );
  }

  private simulateOneYear(): void {
    this.bumpYear();
    const initialCount = this.humans.length;
    const bornCount = this.makeLove();
    const buriedCount = this.buryDead();
    const appliedCatastrophe = this.applyRandomCatastrophe();
    const catastropheDeadCount = Math.abs(
      this.humans.length + buriedCount - bornCount - initialCount
    );

    this.logYear(
      bornCount,
      appliedCatastrophe,
      buriedCount + catastropheDeadCount
    );
    this.checkGoals();
  }

  private logYear(
    bornCount: number,
    catastrophe: ICatastrophe | null,
    deadCount: number
  ): void {
    const messageParts = [];

    // births and deaths
    if (catastrophe === null) {
      messageParts.push(`⚰️${deadCount}`.padEnd(6));
    } else {
      messageParts.push(`${catastrophe.type}${deadCount}`.padEnd(6));
    }

    messageParts.push(`🤱${bornCount}`.padEnd(6));

    // current population
    if (deadCount > bornCount) {
      messageParts.push(`${this.humans.length}↓`);
    } else if (bornCount > deadCount) {
      messageParts.push(`${this.humans.length}↑`);
    } else {
      messageParts.push(`${this.humans.length}–`);
    }

    const babyCount = this.getBabyCount();
    const fertileCount = this.getFertileCount();
    const elderCount = this.getElderCount();
    messageParts.push(`{👶${babyCount} 👩${fertileCount} 👵${elderCount}}`);

    // final message
    logger.log(`y${this.currentYear} ${messageParts.join(" ")}`);
  }

  private bumpYear(): void {
    this.currentYear++;
    for (const human of this.humans) {
      human.bumpAge();
    }
  }

  private makeLove(): number {
    let bornCount = 0;

    if (this.humans.length <= 1) {
      return bornCount;
    } else {
      for (let i = this.humans.length - 1; i >= 0; i--) {
        const human = this.humans[i];
        const mate = this.getRandomHuman();
        if (this.isLovePossibleAndSuccessful(human, mate)) {
          const baby = new Human(human, mate);
          this.humans.push(baby);
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

  private buryDead(): number {
    let buriedCount = 0;
    for (let i = this.humans.length - 1; i >= 0; i--) {
      if (this.humans[i].isDead()) {
        const deadBody = this.humans.splice(i, 1);
        buriedCount++;
      }
    }
    return buriedCount;
  }

  // kills 20-80% of population (if happens)
  private applyRandomCatastrophe(): ICatastrophe | null {
    // every catastrophe has 1% chance of happening
    if (HumanExistence.catastrophes.length >= generator.getRandomPercent()) {
      const catastrophe = this.getRandomCatastrophe();
      const killCount = Math.floor(
        this.humans.length * (catastrophe.killPercentage * 0.01)
      );
      // kill random X humans
      for (let i = killCount; i >= 0; i--) {
        this.humans.splice(Math.floor(Math.random() * this.humans.length), 1);
      }
      return catastrophe;
    } else {
      return null;
    }
  }

  private checkGoals(): void {
    if (this.humans.length === 0) {
      window.clearInterval(this.lifeIntervalId);
      logger.log("All humans died.");
    } else if (this.humans.length >= HumanExistence.targetPopulation) {
      window.clearInterval(this.lifeIntervalId);
      logger.log(
        `Human population reached ${
          HumanExistence.targetPopulation
        }. They're safe now.`
      );
    }
  }

  private getBabyCount(): number {
    let babyCount = 0;
    for (const human of this.humans) {
      if (human.isBaby()) {
        babyCount++;
      }
    }
    return babyCount;
  }

  private getElderCount(): number {
    let elderCount = 0;
    for (const human of this.humans) {
      if (human.isElder()) {
        elderCount++;
      }
    }
    return elderCount;
  }

  private getFertileCount(): number {
    let fertileCount = 0;
    for (const human of this.humans) {
      if (human.isFertile()) {
        fertileCount++;
      }
    }
    return fertileCount;
  }

  private getRandomHuman(): Human {
    return this.humans[generator.getRandomNumber(0, this.humans.length - 1)];
  }

  private getRandomCatastrophe(): ICatastrophe {
    return HumanExistence.catastrophes[
      generator.getRandomNumber(0, HumanExistence.catastrophes.length - 1)
    ];
  }
}

window.onload = (): void => {
  const humanExistence = new HumanExistence();
};
