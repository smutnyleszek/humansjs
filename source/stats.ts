import {
  CatastropheName,
  Catastrophes,
  ICatastrophe,
  isYearMillenium,
} from "./common";

enum Achievement {
  // A catastrophy that happened on millenium and caused more death
  MilleniumCatastrophe = "A prophecy was fulfilled!",
  // A catastrophy that lasted a century
  DecadeLongCatastrophe = "Lived through a decade of aggression.",
}

interface IAllStats {
  achievements: string[];
  catastrophesCount: ICatastrophesCount;
  catastrophesCountSum: number;
  highestPopulation: number;
  lowestPopulation: number;
  totalBornCount: number;
}

type ICatastrophesCount = {
  [K in CatastropheName]: number;
};

class Stats {
  private achievements: Set<Achievement> = new Set();
  private catastrophesCount: ICatastrophesCount = {
    "climate-warming": 0,
    cyclone: 0,
    drought: 0,
    earthquake: 0,
    flood: 0,
    "ice-age": 0,
    meteor: 0,
    plague: 0,
    religion: 0,
    "volcano-eruption": 0,
    war: 0,
  };
  private catastrophesCountSum: number = 0;
  private consecutiveCatastropheYears: number = 0;
  private highestPopulation: number = 0;
  private lowestPopulation: number = Infinity;
  private totalBornCount: number = 0;

  public constructor() {
    Catastrophes.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.name] = 0;
    });
  }

  public getAll(): IAllStats {
    return {
      achievements: Array.from(this.achievements),
      catastrophesCount: this.catastrophesCount,
      catastrophesCountSum: this.catastrophesCountSum,
      highestPopulation: this.highestPopulation,
      lowestPopulation: this.lowestPopulation,
      totalBornCount: this.totalBornCount,
    };
  }

  public getCatastrophePercentage(name: CatastropheName): number {
    if (this.catastrophesCountSum === 0) {
      return 0;
    } else {
      return Number(
        (
          (this.catastrophesCount[name] / this.catastrophesCountSum) *
          100
        ).toFixed(1)
      );
    }
  }

  public reportBornCount(count: number): void {
    this.totalBornCount += count;
  }

  // handles consecutiveCatastropheYears and counting catastrophes
  public reportCatastrophe(
    catastrophe: ICatastrophe | null,
    year: number
  ): void {
    if (catastrophe === null) {
      this.consecutiveCatastropheYears = 0;
    } else {
      this.catastrophesCount[catastrophe.name]++;
      this.catastrophesCountSum++;
      this.consecutiveCatastropheYears++;

      if (this.consecutiveCatastropheYears === 10) {
        this.achievements.add(Achievement.DecadeLongCatastrophe);
      }
      if (isYearMillenium(year)) {
        this.achievements.add(Achievement.MilleniumCatastrophe);
      }
    }
  }

  public reportPopulation(count: number): void {
    this.highestPopulation = Math.max(this.highestPopulation, count);
    this.lowestPopulation = Math.min(this.lowestPopulation, count);
  }

  public clear(): void {
    Catastrophes.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.name] = 0;
    });
    this.catastrophesCountSum = 0;
    this.highestPopulation = 0;
    this.lowestPopulation = Infinity;
    this.totalBornCount = 0;
  }
}

export const stats = new Stats();
