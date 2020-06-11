import { CATASTROPHES, CatastropheType, ICatastrophe } from "./common";

interface IAllStats {
  catastrophesCount: { [key: string]: number };
  highestPopulation: number;
  lowestPopulation: number;
  totalBornCount: number;
}

class Stats {
  private catastrophesCount: { [key: string]: number } = {};
  private highestPopulation: number = 0;
  private lowestPopulation: number = Infinity;
  private totalBornCount: number = 0;

  public constructor() {
    CATASTROPHES.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.type] = 0;
    });
  }

  public getAll(): IAllStats {
    return {
      catastrophesCount: this.catastrophesCount,
      highestPopulation: this.highestPopulation,
      lowestPopulation: this.lowestPopulation,
      totalBornCount: this.totalBornCount,
    };
  }

  public reportBornCount(count: number): void {
    this.totalBornCount += count;
  }

  public reportCatastropheCount(type: CatastropheType): void {
    this.catastrophesCount[type]++;
  }

  public reportPopulation(count: number): void {
    this.highestPopulation = Math.max(this.highestPopulation, count);
    this.lowestPopulation = Math.min(this.lowestPopulation, count);
  }
}

export const stats = new Stats();
