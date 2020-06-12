import { CATASTROPHES, ICatastrophe, PopulationStatus } from "./common";
import { Existence } from "./existence";
import { logger } from "./logger";

describe("Existence", () => {
  it("should be able to return random catastrophe", () => {
    const humanExistence = new Existence(9999, false);
    const catastrophesCount: any = {};
    CATASTROPHES.forEach((catastrophe: ICatastrophe) => {
      catastrophesCount[catastrophe.name] = 0;
    });
    for (let i = 0; i < 1000; i++) {
      const randomCatastrophe = humanExistence.getRandomCatastrophe();
      catastrophesCount[randomCatastrophe.name]++;
    }
    Object.keys(catastrophesCount).forEach((catastropheType: string) => {
      expect(catastrophesCount[catastropheType] >= 1).toBeTruthy();
    });
  });

  it("should successfully simulate existence", () => {
    const humanExistence = new Existence(9999, false);
    while (
      humanExistence.getPopulationStatus() === PopulationStatus.Struggling
    ) {
      humanExistence.simulateOneYear();
    }
    expect(
      humanExistence.getPopulationStatus() === PopulationStatus.Extinct ||
        humanExistence.getPopulationStatus() === PopulationStatus.Safe
    ).toBeTruthy();
  });

  it("should log information if enabled", () => {
    const humanExistence = new Existence(9999, true);
    while (
      humanExistence.getPopulationStatus() === PopulationStatus.Struggling
    ) {
      humanExistence.simulateOneYear();
    }
    if (logger.output) {
      expect(logger.output.innerText.length > 10).toBeTruthy();
    }
  });

  // this is the game balance test
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

    // console.log(`Total ${totalExtinct} extinct and ${totalSafe} safe.`);
    expect(totalExtinct >= 60).toBeTruthy();
    expect(totalSafe >= 10).toBeTruthy();
  });
});
