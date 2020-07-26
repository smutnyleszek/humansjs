import mixpanel from "mixpanel-browser";
import * as pack from "../package.json";
import { CatastropheName, PopulationStatus } from "./common";
import { IGameOverIncidentData, IncidentName, listen } from "./incidents";
import { stats } from "./stats";

enum EventId {
  GameOver = "gameover",
}

interface IGameOverData {
  populationMax: number;
  populationMin: number;
  status: PopulationStatus;
  topCatastrophe: CatastropheName;
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

  private onGameOver(evt: CustomEvent<IGameOverIncidentData>) {
    const allStats = stats.getAll();
    this.trackEvent(EventId.GameOver, {
      populationMax: allStats.highestPopulation,
      populationMin: allStats.lowestPopulation,
      status: evt.detail.status,
      topCatastrophe: allStats.topCatastrophe,
      totalCatastrophes: allStats.catastrophesCountSum,
      year: evt.detail.year,
    });
  }

  private trackEvent(id: string, data: IGameOverData): void {
    // always include game version
    data.version = pack.version;
    mixpanel.track(id, data);
  }
}
