import { Existence, PopulationStatus } from "./existence";

describe("Existence", () => {
  it("should create initial population", () => {
    const humanExistence = new Existence(true);
    expect(document.body.textContent).toBe("4129 humans appeared.\n");
  });

  it("should successfully simulate existence", () => {
    const humanExistence = new Existence(false);
    while (humanExistence.getPopulationStatus() === PopulationStatus.Struggling) {
      humanExistence.simulateOneYear();
    }
    expect(
      humanExistence.getPopulationStatus() === PopulationStatus.Extinct ||
      humanExistence.getPopulationStatus() === PopulationStatus.Safe
    ).toBeTruthy();
  });
});
