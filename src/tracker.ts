import Analytics from "analytics";
import googleAnalytics from "@analytics/google-analytics";
import * as pack from "../package.json";

export enum EventId {
  Test = "test",
  GameOver = "gameover",
}

class Tracker {
  private analytics: any;

  public constructor() {
    this.analytics = Analytics({
      app: "exisim",
      plugins: [
        googleAnalytics({
          trackingId: "UA-168725324-1",
        }),
      ],
    });
  }

  public trackEvent(id: string, data: any): void {
    // include game version
    data.version = pack.version;
    this.analytics.track(id, data);
  }
}

export const tracker = new Tracker();
