import { init, track } from "insights-js";
import * as pack from "../package.json";

export enum EventId {
  Test = "test",
  GameOver = "game-over"
}

class Tracker {
  public constructor() {
    init("PwyE12lRXwDKH5aP");
  }

  public trackEvent(id: string, data: any): void {
    data.version = pack.version;
    track({
      id: id,
      parameters: data
    });
  }
}

export const tracker = new Tracker();
