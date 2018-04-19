import { logger } from "./logger";
import { Humans } from "./humans";
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

  private humans: Humans;
  private lifeIntervalId: number = 0;
  private currentYear: number = 0;

  public constructor() {
    this.humans = new Humans(HumanExistence.initialPopulation);
    logger.log(`${this.humans.getTotalCount()} humans appeared.`);

    this.startLife();
  }

  private startLife(): void {
    this.lifeIntervalId = window.setInterval(
      this.simulateOneYear.bind(this),
      HumanExistence.yearTime
    );
  }

  private simulateOneYear(): void {
    this.bumpYear();
    const initialCount = this.humans.getTotalCount();
    const bornCount = this.humans.makeLove();
    const buriedCount = this.humans.buryDead();
    const appliedCatastrophe = this.applyRandomCatastrophe();
    const catastropheDeadCount = Math.abs(
      this.humans.getTotalCount() + buriedCount - bornCount - initialCount
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
    const totalCount = this.humans.getTotalCount();
    if (deadCount > bornCount) {
      messageParts.push(`${totalCount}↓`);
    } else if (bornCount > deadCount) {
      messageParts.push(`${totalCount}↑`);
    } else {
      messageParts.push(`${totalCount}–`);
    }

    const groupsCount = this.humans.getAgeGroupsCount();
    messageParts.push(
      `{👶${groupsCount.baby} 👩${groupsCount.adult} 👵${groupsCount.elder}}`
    );

    const averageVitality = this.humans.getAverageVitality();

    messageParts.push(`💓${averageVitality}`);

    // final message
    logger.log(`y${this.currentYear} ${messageParts.join(" ")}`);
  }

  private bumpYear(): void {
    this.currentYear++;
    this.humans.growByOneYear();
  }

  // kills 20-80% of population (if happens)
  private applyRandomCatastrophe(): ICatastrophe | null {
    // every catastrophe has 1% chance of happening
    if (HumanExistence.catastrophes.length >= generator.getRandomPercent()) {
      const catastrophe = this.getRandomCatastrophe();
      this.humans.killRandomHumans(
        this.humans.getTotalCount() * (catastrophe.killPercentage * 0.01)
      );
      return catastrophe;
    } else {
      return null;
    }
  }

  private checkGoals(): void {
    if (this.humans.getTotalCount() === 0) {
      window.clearInterval(this.lifeIntervalId);
      logger.log("All humans died.");
    } else if (this.humans.getTotalCount() >= HumanExistence.targetPopulation) {
      window.clearInterval(this.lifeIntervalId);
      logger.log(
        `Human population reached ${
          HumanExistence.targetPopulation
        }. They're safe now.`
      );
    }
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
