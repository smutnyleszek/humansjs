import { logger } from "./logger";
import { Human } from "./human";
import { generator } from "./generator";

class HumanExistence {
  private static readonly initialPopulation: number = 100;
  private static readonly targetPopulation: number = 10000;
  private static readonly yearTime: number = 0.1 * 1000; // seconds
  private static readonly loveChance: number = 25;
  private static readonly catastropheChance: number = 5;

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
    logger.log(`God created ${this.humans.length} humans.`);
  }

  private startLife(): void {
    this.lifeIntervalId = window.setInterval(
      this.simulateOneYear.bind(this),
      HumanExistence.yearTime
    );
  }

  private simulateOneYear(): void {
    this.bumpYear();
    const oldAgeDeadCount = this.buryDead();
    const bornCount = this.makeLove();
    const catastropheDeadCount = this.applyRandomCatastrophicEvent();

    let message =
      `Year ${this.currentYear}:` +
      ` ☠️ ${oldAgeDeadCount + catastropheDeadCount},` +
      ` 👶 ${bornCount},` +
      ` 🌍 ${this.humans.length}`;

    if (catastropheDeadCount > 0) {
      message += " 🌋";
    }

    logger.log(message);
    this.checkGoals();
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
        if (
          generator.getRandomNumber(0, 100) <= HumanExistence.loveChance &&
          human.isAdult() &&
          mate.isAdult()
        ) {
          const child = new Human((human.mortality + mate.mortality) / 2);
          this.humans.push(child);
          bornCount++;
        }
      }
    }
    return bornCount;
  }

  private buryDead(): number {
    let diedCount = 0;
    for (let i = this.humans.length - 1; i >= 0; i--) {
      if (this.humans[i].isDead()) {
        const deadBody = this.humans.splice(i, 1);
        diedCount++;
      }
    }
    return diedCount;
  }

  // always takes greater half of population (if happens)
  private applyRandomCatastrophicEvent(): number {
    if (generator.getRandomNumber(0, 100) <= HumanExistence.catastropheChance) {
      const halfMark = Math.floor(this.humans.length * 0.5);
      const died = this.humans.slice(0, halfMark);
      this.humans = this.humans.slice(halfMark, this.humans.length - 1);
      return died.length;
    } else {
      return 0;
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

  private getRandomHuman(): Human {
    return this.humans[generator.getRandomNumber(0, this.humans.length - 1)];
  }
}

const humanExistence = new HumanExistence();
