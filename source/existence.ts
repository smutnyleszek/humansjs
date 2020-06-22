import {
  CatastrophePersistence,
  Catastrophes,
  ICatastrophe,
  isYearMillenium,
  PopulationStatus,
} from "./common";
import { generator } from "./generator";
import { Humans } from "./humans";
import { logger } from "./logger";
import { stats } from "./stats";
import { tracker } from "./tracker";

const MaxChars: number = "↓1234567 ❋123456 ✝1234567 y1234".length;

export class Existence {
  // https://en.wikipedia.org/wiki/Minimum_viable_population
  private static readonly initialPopulation: number = 4169;
  private static readonly yearTime: number = 1 / 8 * 1000;
  // FYI this line is the length of maximum output length
  private static readonly longLine: string = "-".repeat(MaxChars);

  private currentYear: number = 0;
  private humans: Humans;
  private isLoggingEnabled: boolean = false;
  private lastYearCatastrophe: ICatastrophe | null = null;
  private lifeIntervalId: number = 0;
  private targetPopulation: number;

  public constructor(targetPopulation: number, enableLogging: boolean) {
    this.targetPopulation = targetPopulation;
    this.isLoggingEnabled = enableLogging;

    this.humans = new Humans(Existence.initialPopulation);

    stats.reportBornCount(this.humans.getTotalCount());

    if (this.isLoggingEnabled) {
      logger.log(Existence.longLine);
      logger.log(`${this.humans.getTotalCount()} humans appeared.`);
      logger.log(Existence.longLine);
    }
  }

  public startLife(): void {
    this.lifeIntervalId = window.setInterval(
      this.simulateOneYear.bind(this),
      Existence.yearTime
    );
  }

  public simulateOneYear(): void {
    // 1. add one year
    this.bumpYear();

    const initialCount = this.humans.getTotalCount();

    // 2. people are born
    const bornCount = this.humans.makeLove();
    stats.reportBornCount(bornCount);

    // 3. people die of old age
    const buriedCount = this.humans.buryDead();

    // 4. a catastrophe could happen
    const currentCatastrophe = this.checkForCatastrophe();
    const catastropheDeadCount = Math.abs(
      this.humans.getTotalCount() + buriedCount - bornCount - initialCount
    );
    stats.reportCatastrophe(currentCatastrophe, this.currentYear);
    // store applied catastrophe for next year
    this.lastYearCatastrophe = currentCatastrophe;

    // 5. report on what happened
    stats.reportPopulation(this.humans.getTotalCount());
    if (this.isLoggingEnabled) {
      this.logYear(
        bornCount,
        currentCatastrophe,
        buriedCount + catastropheDeadCount
      );
    }

    // 6. check if game over
    this.checkForGameOver();
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
    return Catastrophes[generator.getRandomNumber(0, Catastrophes.length - 1)];
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
      messageParts.push(`<neg>&darr;${totalCount}</neg>`);
    } else if (bornCount > deadCount) {
      messageParts.push(`<pos>&uarr;${totalCount}</pos>`);
    } else {
      messageParts.push(`&middot;${totalCount}`);
    }

    // born count
    messageParts.push(`❋${bornCount}`);

    // dead count with catastrophe
    if (catastrophe === null) {
      messageParts.push(`✝${deadCount}`);
    } else {
      messageParts.push(`${catastrophe.icon}${deadCount}`);
    }

    // year
    messageParts.push(`y${this.currentYear}`);

    // make a year with a catastrophe more pronounced
    if (catastrophe !== null) {
      messageParts.unshift("<em>");
      messageParts.push("</em>");
    }

    // final message
    logger.log(messageParts.join(" "));
  }

  private bumpYear(): void {
    this.currentYear++;
    this.humans.growByOneYear();
  }

  // kills % of population (if happens)
  private checkForCatastrophe(): ICatastrophe | null {
    if (
      this.lastYearCatastrophe !== null &&
      this.lastYearCatastrophe.isPersistent &&
      CatastrophePersistence >= generator.getRandomPercent()
    ) {
      // a persistent catastrophe can last multiple years
      this.applyCatastrophe(this.lastYearCatastrophe);
      return this.lastYearCatastrophe;
    } else if (Catastrophes.length >= generator.getRandomPercent()) {
      // every catastrophe has 1% chance of happening
      const randomCatastrophe = this.getRandomCatastrophe();
      this.applyCatastrophe(randomCatastrophe);
      return randomCatastrophe;
    } else {
      return null;
    }
  }

  // drops a catastrophe upon the population
  private applyCatastrophe(catastrophe: ICatastrophe): void {
    const killPercentage = generator.getRandomNumber(
      catastrophe.killMin,
      catastrophe.killMax
    );
    let numberKilled = this.humans.getTotalCount() * (killPercentage / 100);
    if (isYearMillenium(this.currentYear)) {
      // double death toll for catastrophe that happens on a millenium
      // it is possible that humans will get extinct by it
      numberKilled *= 2;
    }
    this.humans.killRandomHumans(numberKilled);
  }

  private checkForGameOver(): void {
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
    const allStats = stats.getAll();

    if (this.isLoggingEnabled) {
      logger.log(Existence.longLine);
      if (status === PopulationStatus.Extinct) {
        logger.log("All humans died.");
      } else if (status === PopulationStatus.Safe) {
        logger.log(`Human population reached ${this.targetPopulation}.`);
        logger.log("They're safe now.");
      }
      logger.log(Existence.longLine);
      logger.log(`Total people born: ${allStats.totalBornCount}.`);
      for (const achievement of allStats.achievements) {
        logger.log(achievement);
      }
    }

    tracker.trackGameOver(status, this.currentYear);
  }
}
