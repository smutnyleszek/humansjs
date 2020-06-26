import { CatastropheName, getCatastrophe } from "./common";
import { IncidentName, publish } from "./incidents";
import { stats } from "./stats";

describe("stats", () => {
  beforeEach(() => {
    stats.clear();
  });

  it("should increment catastrophes count", () => {
    expect(stats.getAll().catastrophesCount[CatastropheName.War]).toBe(0);
    expect(stats.getAll().catastrophesCount[CatastropheName.Religion]).toBe(0);
    expect(stats.getAll().catastrophesCountSum).toBe(0);
    publish(IncidentName.Catastrophe, {
      catastrophe: getCatastrophe(CatastropheName.War),
      year: 1,
    });
    expect(stats.getAll().catastrophesCount[CatastropheName.War]).toBe(1);
    expect(stats.getAll().catastrophesCount[CatastropheName.Religion]).toBe(0);
    expect(stats.getAll().catastrophesCountSum).toBe(1);
    publish(IncidentName.Catastrophe, {
      catastrophe: getCatastrophe(CatastropheName.War),
      year: 2,
    });
    publish(IncidentName.Catastrophe, {
      catastrophe: getCatastrophe(CatastropheName.Religion),
      year: 3,
    });
    expect(stats.getAll().catastrophesCount[CatastropheName.War]).toBe(2);
    expect(stats.getAll().catastrophesCount[CatastropheName.Religion]).toBe(1);
    expect(stats.getAll().catastrophesCountSum).toBe(3);
  });

  it("should return percentage for a catastrophe", () => {
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(0);
    publish(IncidentName.Catastrophe, {
      catastrophe: getCatastrophe(CatastropheName.War),
      year: 1,
    });
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(100);
    publish(IncidentName.Catastrophe, {
      catastrophe: getCatastrophe(CatastropheName.Religion),
      year: 2,
    });
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(50);
    publish(IncidentName.Catastrophe, {
      catastrophe: getCatastrophe(CatastropheName.Religion),
      year: 3,
    });
    expect(stats.getCatastrophePercentage(CatastropheName.War)).toBe(33.3);
    expect(stats.getCatastrophePercentage(CatastropheName.Religion)).toBe(66.7);
  });

  it("should store highest and lowest population", () => {
    publish(IncidentName.Population, { count: 1000 });
    expect(stats.getAll().highestPopulation).toBe(1000);
    expect(stats.getAll().lowestPopulation).toBe(1000);
    publish(IncidentName.Population, { count: 5000 });
    expect(stats.getAll().highestPopulation).toBe(5000);
    expect(stats.getAll().lowestPopulation).toBe(1000);
    publish(IncidentName.Population, { count: 4000 });
    expect(stats.getAll().highestPopulation).toBe(5000);
    expect(stats.getAll().lowestPopulation).toBe(1000);
    publish(IncidentName.Population, { count: 200 });
    expect(stats.getAll().highestPopulation).toBe(5000);
    expect(stats.getAll().lowestPopulation).toBe(200);
  });
});
