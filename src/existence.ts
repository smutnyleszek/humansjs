import { logger } from "./logger";
import { tracker, EventId } from "./tracker";
import { Humans } from "./humans";
import { generator } from "./generator";

export interface ICatastrophe {
  type: string;
  killMin: number;
  killMax: number;
}

export enum PopulationStatus {
  Extinct = "extinct",
  Struggling = "struggling",
  Safe = "safe",
}

export const CATASTROPHES: ICatastrophe[] = [
  // meteor - https://en.wikipedia.org/wiki/Chicxulub_crater
  { type: "☄️", killMin: 0, killMax: 75 },
  // plague - https://en.wikipedia.org/wiki/Black_Death
  { type: "🤢", killMin: 30, killMax: 60 },
  // famine - https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll
  { type: "🏜", killMin: 10, killMax: 28 },
  // ice age
  { type: "🥶", killMin: 15, killMax: 20 },
  // climate warming - http://www.impactlab.org/news-insights/valuing-climate-change-mortality/
  { type: "🌡️", killMin: 16, killMax: 19 },
  // flood
  { type: "🌊", killMin: 3, killMax: 13 },
  // wildfire
  { type: "🔥", killMin: 11, killMax: 12 },
  // volcano eruption
  { type: "🌋", killMin: 1, killMax: 9 },
  // cyclone
  { type: "🌪", killMin: 6, killMax: 6 },
  // war - https://en.m.wikipedia.org/wiki/World_War_II_casualties
  { type: "⚔️", killMin: 2, killMax: 3 },
  // religion - https://rationalwiki.org/wiki/Death_toll_of_Christianity
  { type: "🙏", killMin: 1, killMax: 2 },
];

export class Existence {
  // https://en.wikipedia.org/wiki/Minimum_viable_population
  private static readonly initialPopulation: number = 4169;
  private static readonly yearTime: number = 0.1 * 1000; // seconds
  // FYI this line is the length of maximum output length
  private static readonly longLine: string =
    "--------------------------------------------";

  private targetPopulation: number;
  private humans: Humans;
  private lifeIntervalId: number = 0;
  private currentYear: number = 0;
  private isLoggingEnabled: boolean = false;

  public constructor(targetPopulation: number, enableLogging: boolean) {
    this.targetPopulation = targetPopulation;
    this.humans = new Humans(Existence.initialPopulation);
    this.isLoggingEnabled = enableLogging;
    if (this.isLoggingEnabled) {
      logger.log(Existence.longLine);
      logger.log(`${this.humans.getTotalCount()} humans appeared.`);
    }
  }

  public startLife(): void {
    tracker.trackEvent(EventId.Test, {
      text: "abc",
      number: 123,
      list: ["pterodactyl", "diplodocus"],
      obj: {name: "Qwerty", age: 33}
    });
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
    } else if (this.humans.getTotalCount() >= this.targetPopulation) {
      return PopulationStatus.Safe;
    } else {
      return PopulationStatus.Struggling;
    }
  }

  public getRandomCatastrophe(): ICatastrophe {
    return CATASTROPHES[generator.getRandomNumber(0, CATASTROPHES.length - 1)];
  }

  private logYear(
    bornCount: number,
    catastrophe: ICatastrophe | null,
    deadCount: number
  ): void {
    const messageParts: any[] = [];

    // current population
    const totalCount = this.humans.getTotalCount();
    if (deadCount > bornCount) {
      messageParts.push(`<span class="negative">&darr;${totalCount}</span>`);
    } else if (bornCount > deadCount) {
      messageParts.push(`<span class="positive">&uarr;${totalCount}</span>`);
    } else {
      messageParts.push(`&middot;${totalCount}`);
    }

    // born count
    messageParts.push(`❋${bornCount}`);

    // dead count with catastrophe
    if (catastrophe === null) {
      messageParts.push(`✝${deadCount}`);
    } else {
      messageParts.push(`${catastrophe.type}${deadCount}`);
    }

    // age groups population
    const groupsCount = this.humans.getAgeGroupsCount();
    messageParts.push(`(👶${groupsCount.baby} 👩${groupsCount.adult})`);

    // year
    messageParts.push(`y${this.currentYear}`);

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
    if (CATASTROPHES.length >= generator.getRandomPercent()) {
      const catastrophe = this.getRandomCatastrophe();
      const killPercentage = generator.getRandomNumber(
        catastrophe.killMin,
        catastrophe.killMax
      );
      this.humans.killRandomHumans(
        this.humans.getTotalCount() * (killPercentage / 100)
      );
      return catastrophe;
    } else {
      return null;
    }
  }

  private checkGoals(): void {
    const status = this.getPopulationStatus();
    if (
      status === PopulationStatus.Extinct ||
      status === PopulationStatus.Safe
    ) {
      window.clearInterval(this.lifeIntervalId);
      this.gameOver();
    }
  }

  private gameOver(): void {
    const status = this.getPopulationStatus();

    if (this.isLoggingEnabled) {
      if (status === PopulationStatus.Extinct) {
        logger.log("All humans died.");
      } else if (status === PopulationStatus.Safe) {
        logger.log(
          `Human population reached ${this.targetPopulation}. They're safe now.`
        );
      }
      logger.log(Existence.longLine);
    }

    tracker.trackEvent(EventId.GameOver, {
      status: status,
      year: this.currentYear,
    });
  }
}
