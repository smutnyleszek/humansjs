import { CatastropheName, CATASTROPHES, ICatastrophe } from "./common";

interface IAllStats {
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
  private catastrophesCount: ICatastrophesCount = {
    "climate-warming": 0,
    cyclone: 0,
    famine: 0,
    flood: 0,
    "ice-age": 0,
    meteor: 0,
    plague: 0,
    religion: 0,
    "volcano-eruption": 0,
    war: 0,
    wildfire: 0,
  };
  private catastrophesCountSum: number = 0;
  private highestPopulation: number = 0;
  private lowestPopulation: number = Infinity;
  private totalBornCount: number = 0;

  public constructor() {
    CATASTROPHES.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.name] = 0;
    });
  }

  public getAll(): IAllStats {
    return {
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

  public reportCatastropheCount(name: CatastropheName): void {
    this.catastrophesCount[name]++;
    this.catastrophesCountSum++;
  }

  public reportPopulation(count: number): void {
    this.highestPopulation = Math.max(this.highestPopulation, count);
    this.lowestPopulation = Math.min(this.lowestPopulation, count);
  }

  public clear(): void {
    CATASTROPHES.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.name] = 0;
    });
    this.catastrophesCountSum = 0;
    this.highestPopulation = 0;
    this.lowestPopulation = Infinity;
    this.totalBornCount = 0;
  }
}

export const stats = new Stats();
