import {
  CatastrophePersistence,
  Catastrophes,
  PopulationStatus,
} from "./common";
import { Existence } from "./existence";

interface IAverageCatastrophe {
  killMax: number;
  killMin: number;
}

function getAverageCatastrophe(): IAverageCatastrophe {
  const mins: number[] = [];
  const maxs: number[] = [];
  Catastrophes.forEach((catastrophe) => {
    let persistenceFactor = 1;
    if (catastrophe.isPersistent) {
      persistenceFactor = (100 + CatastrophePersistence) / 100;
    }
    mins.push(catastrophe.killMin * persistenceFactor);
    maxs.push(catastrophe.killMax * persistenceFactor);
  });
  let minsSum = 0;
  mins.forEach((n: number) => {
    minsSum += n;
  });
  let maxsSum = 0;
  maxs.forEach((n: number) => {
    maxsSum += n;
  });
  return {
    killMax: Math.round(maxsSum / maxs.length),
    killMin: Math.round(minsSum / mins.length),
  };
}

describe("game balance", () => {
  it("should have a balanced set of catastrophes", () => {
    const averageCatastrophe = getAverageCatastrophe();

    expect(averageCatastrophe.killMin).toBeGreaterThanOrEqual(7);
    expect(averageCatastrophe.killMin).toBeLessThanOrEqual(11);
    expect(averageCatastrophe.killMax).toBeGreaterThanOrEqual(20);
    expect(averageCatastrophe.killMax).toBeLessThanOrEqual(24);
  });

  it("should kill all humans in most cases using all catastrophes", () => {
    let totalExtinct = 0;
    let totalSafe = 0;

    for (let i = 0; i < 100; i++) {
      const humanExistence = new Existence(50000, false);
      while (
        humanExistence.getPopulationStatus() === PopulationStatus.Struggling
      ) {
        humanExistence.simulateOneYear();
      }

      if (humanExistence.getPopulationStatus() === PopulationStatus.Extinct) {
        totalExtinct++;
      }
      if (humanExistence.getPopulationStatus() === PopulationStatus.Safe) {
        totalSafe++;
      }
    }

    expect(totalExtinct).toBeGreaterThanOrEqual(70);
    expect(totalSafe).toBeGreaterThanOrEqual(15);
  });
});
