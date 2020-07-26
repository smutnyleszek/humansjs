import {
  CatastropheName,
  Catastrophes,
  ICatastrophe,
  isYearMillenium,
  PopulationStatus,
} from "./common";
import {
  ICatastropheIncidentData,
  IGameOverIncidentData,
  IncidentName,
  IPopulationIncidentData,
  listen,
} from "./incidents";

enum Achievement {
  // A catastrophe that happened on a millenium.
  MilleniumCatastrophe = "A prophecy was fulfilled",
  // A catastrophe that lasted a decade.
  DecadeLongCatastrophe = "Through a decade of aggression",
  // No catastrophe happened for half a century.
  HalfCenturyFree = "Fifty summers of love",
  SafeQuick = "Life cannot be contained",
  SafeSlow = "Reaching the stars from the mountain of bodies",
  SafeFromLow = "The last humans on earth",
  ExtinctQuick = "A short expiration date",
  ExtinctSlow = "May we live long and die out",
  ExtinctFromHigh = "The mighty fall of the human leviathan",
  TopCatastropheClimate = "Act as if the house is on fire, because it is",
  TopCatastropheCyclone = "The downward spiral nightmare",
  TopCatastropheDrought = "The earth was thirsty, but only the human blood flowed",
  TopCatastropheEarthquake = "They fell screaming into the depths of the chasm",
  TopCatastropheFlood = "Drowned by the life giving fluid",
  TopCatastropheIce = "Trapped under ice",
  TopCatastropheMeteor = "A death from outer space",
  TopCatastrophePlague = "A cure for the cancer of this planet",
  TopCatastropheReligion = "His face was completely covered in blood, except where it had been partially washed clean by his tears",
  TopCatastropheVolcano = "Hot blood from the planet's wound",
  TopCatastropheWar = "When you fight fire with fire, fire is guaranteed to win",
}

// NOTE: The count of persistent catastrophes is growing more rapidly,
// thus making it very hard for non-persistent catastrophes to be popular.
const TopCatastropheMap = new Map([
  [CatastropheName.Climate, Achievement.TopCatastropheClimate],
  [CatastropheName.Cyclone, Achievement.TopCatastropheCyclone],
  [CatastropheName.Drought, Achievement.TopCatastropheDrought],
  [CatastropheName.Earthquake, Achievement.TopCatastropheEarthquake],
  [CatastropheName.Flood, Achievement.TopCatastropheFlood],
  [CatastropheName.Ice, Achievement.TopCatastropheIce],
  [CatastropheName.Meteor, Achievement.TopCatastropheMeteor],
  [CatastropheName.Plague, Achievement.TopCatastrophePlague],
  [CatastropheName.Religion, Achievement.TopCatastropheReligion],
  [CatastropheName.Volcano, Achievement.TopCatastropheVolcano],
  [CatastropheName.War, Achievement.TopCatastropheWar],
]);

interface IAllStats {
  achievements: string[];
  catastrophesCount: ICatastrophesCount;
  catastrophesCountSum: number;
  highestPopulation: number;
  lowestPopulation: number;
  topCatastrophe: CatastropheName;
}

type ICatastrophesCount = {
  [K in CatastropheName]: number;
};

export class Stats {
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
  private consecutiveFreeYears: number = 0;
  private highestPopulation: number = 0;
  private lowestPopulation: number = Infinity;

  public constructor() {
    Catastrophes.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.name] = 0;
    });
    listen(IncidentName.Catastrophe, this.onCatastrophe.bind(this));
    listen(IncidentName.Population, this.onPopulation.bind(this));
    listen(IncidentName.GameOver, this.onGameOver.bind(this));
  }

  public getAll(): IAllStats {
    const topCatastrophe = this.getTopCatastrophe();
    let topCatastropheName = CatastropheName.War;
    if (topCatastrophe !== null) {
      topCatastropheName = topCatastrophe.name;
    }
    return {
      achievements: Array.from(this.achievements),
      catastrophesCount: this.catastrophesCount,
      catastrophesCountSum: this.catastrophesCountSum,
      highestPopulation: this.highestPopulation,
      lowestPopulation: this.lowestPopulation,
      topCatastrophe: topCatastropheName,
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

  public getTopCatastrophe(): ICatastrophe | null {
    let top: ICatastrophe | null = null;
    let topCount = -1;
    Catastrophes.forEach((catastrophe: ICatastrophe) => {
      if (this.catastrophesCount[catastrophe.name] > topCount) {
        topCount = this.catastrophesCount[catastrophe.name];
        top = catastrophe;
      }
    });
    return top;
  }

  public clear(): void {
    Catastrophes.forEach((catastrophe: ICatastrophe) => {
      this.catastrophesCount[catastrophe.name] = 0;
    });
    this.catastrophesCountSum = 0;
    this.highestPopulation = 0;
    this.lowestPopulation = Infinity;
  }

  // handles consecutiveCatastropheYears and counting catastrophes
  private onCatastrophe(evt: CustomEvent<ICatastropheIncidentData>): void {
    if (evt.detail.catastrophe === null) {
      this.consecutiveCatastropheYears = 0;
      this.consecutiveFreeYears++;

      if (this.consecutiveFreeYears === 50) {
        this.achievements.add(Achievement.HalfCenturyFree);
      }
    } else {
      this.consecutiveFreeYears = 0;
      this.catastrophesCount[evt.detail.catastrophe.name]++;
      this.catastrophesCountSum++;
      this.consecutiveCatastropheYears++;

      if (this.consecutiveCatastropheYears === 10) {
        this.achievements.add(Achievement.DecadeLongCatastrophe);
      }
      if (isYearMillenium(evt.detail.year)) {
        this.achievements.add(Achievement.MilleniumCatastrophe);
      }
    }
  }

  private onPopulation(evt: CustomEvent<IPopulationIncidentData>): void {
    this.highestPopulation = Math.max(this.highestPopulation, evt.detail.count);
    this.lowestPopulation = Math.min(this.lowestPopulation, evt.detail.count);
  }

  private onGameOver(evt: CustomEvent<IGameOverIncidentData>) {
    if (evt.detail.status === PopulationStatus.Extinct) {
      if (evt.detail.year <= 500) {
        this.achievements.add(Achievement.ExtinctQuick);
      }
      if (evt.detail.year >= 6000) {
        this.achievements.add(Achievement.ExtinctSlow);
      }
      if (this.highestPopulation >= 660000) {
        this.achievements.add(Achievement.ExtinctFromHigh);
      }
    }

    if (evt.detail.status === PopulationStatus.Safe) {
      if (evt.detail.year <= 500) {
        this.achievements.add(Achievement.SafeQuick);
      }
      if (evt.detail.year >= 6000) {
        this.achievements.add(Achievement.SafeSlow);
      }
      if (this.lowestPopulation <= 66) {
        this.achievements.add(Achievement.SafeFromLow);
      }
    }

    const topCatastrophe = this.getTopCatastrophe();
    if (topCatastrophe !== null) {
      const topCatastropheAchievement = TopCatastropheMap.get(
        topCatastrophe.name
      );
      if (topCatastropheAchievement) {
        this.achievements.add(topCatastropheAchievement);
      }
    }
  }
}

export const stats = new Stats();
