import {
  CATASTROPHES,
  ICatastrophe,
  MAX_CHARS,
  PopulationStatus,
} from "./common";
import { generator } from "./generator";
import { Humans } from "./humans";
import { logger } from "./logger";
import { stats } from "./stats";
import { tracker } from "./tracker";

export class Existence {
  // https://en.wikipedia.org/wiki/Minimum_viable_population
  private static readonly initialPopulation: number = 4169;
  private static readonly yearTime: number = 0.1 * 1000; // seconds
  // FYI this line is the length of maximum output length
  private static readonly longLine: string = "-".repeat(MAX_CHARS);

  private targetPopulation: number;
  private humans: Humans;
  private lifeIntervalId: number = 0;
  private currentYear: number = 0;
  private isLoggingEnabled: boolean = false;

  public constructor(targetPopulation: number, enableLogging: boolean) {
    this.targetPopulation = targetPopulation;
    this.isLoggingEnabled = enableLogging;

    this.humans = new Humans(Existence.initialPopulation);

    stats.reportBornCount(this.humans.getTotalCount());

    if (this.isLoggingEnabled) {
      logger.log(Existence.longLine);
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
    stats.reportBornCount(bornCount);

    const buriedCount = this.humans.buryDead();

    const appliedCatastrophe = this.applyRandomCatastrophe();
    if (appliedCatastrophe !== null) {
      stats.reportCatastropheCount(appliedCatastrophe.name);
    }

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

    stats.reportPopulation(this.humans.getTotalCount());

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

    // adults percentage
    messageParts.push(`♥️${this.humans.getAdultsPercentage()}%`);

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
    const allStats = stats.getAll();

    if (this.isLoggingEnabled) {
      if (status === PopulationStatus.Extinct) {
        logger.log("All humans died.");
      } else if (status === PopulationStatus.Safe) {
        logger.log(`Human population reached ${this.targetPopulation}.`);
        logger.log("They're safe now.");
      }
      logger.log(Existence.longLine);
      logger.log(`Total people born: ${allStats.totalBornCount}.`);
    }

    tracker.trackGameOver(status, this.currentYear);
  }
}
