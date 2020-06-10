import mixpanel from "mixpanel-browser";
import * as pack from "../package.json";

export enum EventId {
  GameOver = "gameover",
}

class Tracker {
  public constructor() {
    mixpanel.init("b70e3845346d947336c4d57f05e75268", {
      disable_persistence: true,
      ip: false,
      track_pageview: false,
    });
  }

  public trackEvent(id: string, data: any): void {
    // include game version
    data.version = pack.version;
    mixpanel.track(id, data);
  }
}

export const tracker = new Tracker();
