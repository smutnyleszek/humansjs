import mixpanel from "mixpanel-browser";
import * as pack from "../package.json";
import { PopulationStatus } from "./common";
import { stats } from "./stats";

export enum EventId {
  GameOver = "gameover",
}

interface IGameOverData {
  catastrophesCount: { [key: string]: number };
  highestPopulation: number;
  lowestPopulation: number;
  status: PopulationStatus;
  totalBornCount: number;
  version?: string;
  year: number;
}

class Tracker {
  public constructor() {
    mixpanel.init("b70e3845346d947336c4d57f05e75268", {
      disable_persistence: true,
      ip: false,
      track_pageview: false,
    });
  }

  public trackGameOver(status: PopulationStatus, year: number) {
    const allStats = stats.getAll();
    this.trackEvent(EventId.GameOver, {
      catastrophesCount: allStats.catastrophesCount,
      highestPopulation: allStats.highestPopulation,
      lowestPopulation: allStats.lowestPopulation,
      status,
      totalBornCount: allStats.totalBornCount,
      year,
    });
  }

  private trackEvent(id: string, data: IGameOverData): void {
    // always include game version
    data.version = pack.version;
    mixpanel.track(id, data);
  }
}

export const tracker = new Tracker();
