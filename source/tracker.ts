import mixpanel from "mixpanel-browser";
import * as pack from "../package.json";
import { CatastropheName, PopulationStatus } from "./common";
import { IncidentName, listen } from "./incidents";
import { stats } from "./stats";

enum EventId {
  GameOver = "gameover",
}

interface IGameOverData {
  catastropheClimate: number;
  catastropheCyclone: number;
  catastropheDrought: number;
  catastropheEarthquake: number;
  catastropheFlood: number;
  catastropheIce: number;
  catastropheMeteor: number;
  catastrophePlague: number;
  catastropheReligion: number;
  catastropheVolcano: number;
  catastropheWar: number;
  populationMax: number;
  populationMin: number;
  status: PopulationStatus;
  totalCatastrophes: number;
  version?: string;
  year: number;
}

export class Tracker {
  public constructor() {
    mixpanel.init("b70e3845346d947336c4d57f05e75268", {
      disable_persistence: true,
      ip: false,
      track_pageview: false,
    });
    listen(IncidentName.GameOver, this.onGameOver.bind(this));
  }

  private onGameOver(status: PopulationStatus, year: number) {
    const allStats = stats.getAll();
    this.trackEvent(EventId.GameOver, {
      catastropheClimate: stats.getCatastrophePercentage(
        CatastropheName.Climate
      ),
      catastropheCyclone: stats.getCatastrophePercentage(
        CatastropheName.Cyclone
      ),
      catastropheDrought: stats.getCatastrophePercentage(
        CatastropheName.Drought
      ),
      catastropheEarthquake: stats.getCatastrophePercentage(
        CatastropheName.Earthquake
      ),
      catastropheFlood: stats.getCatastrophePercentage(CatastropheName.Flood),
      catastropheIce: stats.getCatastrophePercentage(CatastropheName.Ice),
      catastropheMeteor: stats.getCatastrophePercentage(CatastropheName.Meteor),
      catastrophePlague: stats.getCatastrophePercentage(CatastropheName.Plague),
      catastropheReligion: stats.getCatastrophePercentage(
        CatastropheName.Religion
      ),
      catastropheVolcano: stats.getCatastrophePercentage(
        CatastropheName.Volcano
      ),
      catastropheWar: stats.getCatastrophePercentage(CatastropheName.War),
      populationMax: allStats.highestPopulation,
      populationMin: allStats.lowestPopulation,
      status,
      totalCatastrophes: allStats.catastrophesCountSum,
      year,
    });
  }

  private trackEvent(id: string, data: IGameOverData): void {
    // always include game version
    data.version = pack.version;
    mixpanel.track(id, data);
  }
}
