import { CatastropheType } from "./common";
import { stats } from "./stats";

describe("stats", () => {
  it("should increment born count", () => {
    expect(stats.getAll().totalBornCount).toBe(0);
    stats.reportBornCount(12);
    expect(stats.getAll().totalBornCount).toBe(12);
    stats.reportBornCount(96);
    expect(stats.getAll().totalBornCount).toBe(108);
  });

  it("should increment catastrophe count", () => {
    expect(stats.getAll().catastrophesCount[CatastropheType.War]).toBe(0);
    expect(stats.getAll().catastrophesCount[CatastropheType.Religion]).toBe(0);
    stats.reportCatastropheCount(CatastropheType.War);
    expect(stats.getAll().catastrophesCount[CatastropheType.War]).toBe(1);
    expect(stats.getAll().catastrophesCount[CatastropheType.Religion]).toBe(0);
    stats.reportCatastropheCount(CatastropheType.War);
    stats.reportCatastropheCount(CatastropheType.Religion);
    expect(stats.getAll().catastrophesCount[CatastropheType.War]).toBe(2);
    expect(stats.getAll().catastrophesCount[CatastropheType.Religion]).toBe(1);
  });

  it("should store highest and lowest population", () => {
    stats.reportPopulation(1000);
    expect(stats.getAll().highestPopulation).toBe(1000);
    expect(stats.getAll().lowestPopulation).toBe(1000);
    stats.reportPopulation(5000);
    expect(stats.getAll().highestPopulation).toBe(5000);
    expect(stats.getAll().lowestPopulation).toBe(1000);
    stats.reportPopulation(4000);
    expect(stats.getAll().highestPopulation).toBe(5000);
    expect(stats.getAll().lowestPopulation).toBe(1000);
    stats.reportPopulation(200);
    expect(stats.getAll().highestPopulation).toBe(5000);
    expect(stats.getAll().lowestPopulation).toBe(200);
  });
});
