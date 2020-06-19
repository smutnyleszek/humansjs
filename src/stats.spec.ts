import { CatastropheName, getCatastrophe } from "./common";
import { stats } from "./stats";

describe("stats", () => {
  beforeEach(() => {
    stats.clear();
  });

  it("should increment born count", () => {
    expect(stats.getAll().totalBornCount).toBe(0);
    stats.reportBornCount(12);
    expect(stats.getAll().totalBornCount).toBe(12);
    stats.reportBornCount(96);
    expect(stats.getAll().totalBornCount).toBe(108);
  });

  it("should increment catastrophes count", () => {
    expect(stats.getAll().catastrophesCount[CatastropheName.War]).toBe(0);
    expect(stats.getAll().catastrophesCount[CatastropheName.Religion]).toBe(0);
    expect(stats.getAll().catastrophesCountSum).toBe(0);
    stats.reportCatastrophe(getCatastrophe(CatastropheName.War), 1);
    expect(stats.getAll().catastrophesCount[CatastropheName.War]).toBe(1);
    expect(stats.getAll().catastrophesCount[CatastropheName.Religion]).toBe(0);
    expect(stats.getAll().catastrophesCountSum).toBe(1);
    stats.reportCatastrophe(getCatastrophe(CatastropheName.War), 2);
    stats.reportCatastrophe(getCatastrophe(CatastropheName.Religion), 3);
    expect(stats.getAll().catastrophesCount[CatastropheName.War]).toBe(2);
    expect(stats.getAll().catastrophesCount[CatastropheName.Religion]).toBe(1);
    expect(stats.getAll().catastrophesCountSum).toBe(3);
  });

  it("should return percentage for a catastrophe", () => {
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(0);
    stats.reportCatastrophe(getCatastrophe(CatastropheName.War), 1);
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(100);
    stats.reportCatastrophe(getCatastrophe(CatastropheName.Religion), 2);
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(50);
    stats.reportCatastrophe(getCatastrophe(CatastropheName.Religion), 3);
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(33.3);
    expect(stats.getCatastrophePercentage(CatastropheName.Religion)).toBe(66.7);
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
