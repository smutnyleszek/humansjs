import { Existence, PopulationStatus } from "./existence";

describe("Existence", () => {
  it("should create initial population", () => {
    const humanExistence = new Existence(9999, true);
    expect(document.body.textContent).toBe("4169 humans appeared.\n");
  });

  it("should successfully simulate existence", () => {
    const humanExistence = new Existence(9999, false);
    while (humanExistence.getPopulationStatus() === PopulationStatus.Struggling) {
      humanExistence.simulateOneYear();
    }
    expect(
      humanExistence.getPopulationStatus() === PopulationStatus.Extinct ||
      humanExistence.getPopulationStatus() === PopulationStatus.Safe
    ).toBeTruthy();
  });

  it("should kill all humans in most cases", () => {
    let totalExtinct = 0;
    let totalSafe = 0;
    for (let i = 0; i < 100; i++) {
      const humanExistence = new Existence(50000, false);
      while (humanExistence.getPopulationStatus() === PopulationStatus.Struggling) {
        humanExistence.simulateOneYear();
      }

      if (humanExistence.getPopulationStatus() === PopulationStatus.Extinct) {
        totalExtinct++;
      }
      if (humanExistence.getPopulationStatus() === PopulationStatus.Safe) {
        totalSafe++;
      }
    }
    console.log(`Finished with ${totalExtinct} extinct and ${totalSafe} safe.`);
    expect(totalExtinct >= 60).toBeTruthy();
    expect(totalSafe >= 10).toBeTruthy();
  });
});
