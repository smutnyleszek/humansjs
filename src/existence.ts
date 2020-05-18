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
  killMin: number;
  killMax: number;
}

export enum PopulationStatus {
  Extinct = -1,
  Struggling = 0,
  Safe = 1
}

export class Existence {
  // https://en.wikipedia.org/wiki/Minimum_viable_population
  private static readonly initialPopulation: number = 4169;
  private static readonly targetPopulation: number = 1000000;
  private static readonly yearTime: number = 0.1 * 1000; // seconds

  private static readonly catastrophes: ICatastrophe[] = [
    // https://en.wikipedia.org/wiki/Chicxulub_crater
    { type: "☄️", killMin: 0, killMax: 75 },
    // https://en.wikipedia.org/wiki/Black_Death
    { type: "🤢", killMin: 30, killMax: 60 },
    { type: "❄️", killMin: 20, killMax: 40 },
    // https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll
    { type: "🏜", killMin: 7, killMax: 14 },
    // https://en.m.wikipedia.org/wiki/World_War_II_casualties
    { type: "⚔️", killMin: 4, killMax: 12 },
    { type: "🌊", killMin: 4, killMax: 8 },
    { type: "🌋", killMin: 3, killMax: 5 },
    { type: "🌪", killMin: 2, killMax: 4 }
  ];

  private humans: Humans;
  private lifeIntervalId: number = 0;
  private currentYear: number = 0;
  private isLoggingEnabled: boolean = false;

  public constructor(enableLogging: boolean) {
    this.humans = new Humans(Existence.initialPopulation);
    this.isLoggingEnabled = enableLogging;
    if (this.isLoggingEnabled) {
      logger.log(`${this.humans.getTotalCount()} humans appeared.`);
    }
  }

  public startLife(): void {
    this.lifeIntervalId = window.setInterval(
      this.simulateOneYear.bind(this),
      Existence.yearTime
    );
  }

  public simulateOneYear(): void {
    this.bumpYear();

    const initialCount = this.humans.getTotalCount();

    const bornCount = this.humans.makeLove();

    const buriedCount = this.humans.buryDead();

    const appliedCatastrophe = this.applyRandomCatastrophe();
    const catastropheDeadCount = Math.abs(
      this.humans.getTotalCount() + buriedCount - bornCount - initialCount
    );

    if (this.isLoggingEnabled) {
      this.logYear(
        bornCount,
        appliedCatastrophe,
        buriedCount + catastropheDeadCount
      );
    }

    this.checkGoals();
  }

  public getPopulationStatus(): PopulationStatus {
    if (this.humans.getTotalCount() === 0) {
      return PopulationStatus.Extinct;
    } else if (this.humans.getTotalCount() >= Existence.targetPopulation) {
      return PopulationStatus.Safe;
    } else {
      return PopulationStatus.Struggling;
    }
  }

  private logYear(
    bornCount: number,
    catastrophe: ICatastrophe | null,
    deadCount: number
  ): void {
    // year
    const messageParts = [`y${this.currentYear}`];

    if (catastrophe === null) {
      messageParts.push(`⚰️${deadCount}`);
    } else {
      messageParts.push(`${catastrophe.type}${deadCount}`);
    }

    messageParts.push(`🤱${bornCount}`);

    // current population
    const totalCount = this.humans.getTotalCount();
    if (deadCount > bornCount) {
      messageParts.push(`<span class="negative">&darr;${totalCount}</span>`);
    } else if (bornCount > deadCount) {
      messageParts.push(`<span class="positive">&uarr;${totalCount}</span>`);
    } else {
      messageParts.push(`&middot;${totalCount}`);
    }

    const groupsCount = this.humans.getAgeGroupsCount();
    messageParts.push(`(👶${groupsCount.baby} 👩${groupsCount.adult})`);

    // final message
    logger.log(messageParts.join(" "));
  }

  private bumpYear(): void {
    this.currentYear++;
    this.humans.growByOneYear();
  }

  // kills % of population (if happens)
  private applyRandomCatastrophe(): ICatastrophe | null {
    // every catastrophe has 1% chance of happening
    if (Existence.catastrophes.length >= generator.getRandomPercent()) {
      const catastrophe = this.getRandomCatastrophe();
      const killPercentage = generator.getRandomNumber(catastrophe.killMin, catastrophe.killMax);
      this.humans.killRandomHumans(this.humans.getTotalCount() * (killPercentage / 100));
      return catastrophe;
    } else {
      return null;
    }
  }

  private checkGoals(): void {
    const status = this.getPopulationStatus();
    if (status === PopulationStatus.Extinct) {
      window.clearInterval(this.lifeIntervalId);
      if (this.isLoggingEnabled) {
        logger.log("All humans died.");
      }
    } else if (status === PopulationStatus.Safe) {
      window.clearInterval(this.lifeIntervalId);
      if (this.isLoggingEnabled) {
        logger.log(`Human population reached ${Existence.targetPopulation}. They're safe now.`);
      }
    }
  }

  private getRandomCatastrophe(): ICatastrophe {
    return Existence.catastrophes[
      generator.getRandomNumber(0, Existence.catastrophes.length - 1)
    ];
  }
}
