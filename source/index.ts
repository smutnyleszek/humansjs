import { Existence } from "./existence";
import { Stats, stats } from "./stats";
import { Tracker } from "./tracker";

declare global {
  interface Window {
    existence: Existence;
    stats: Stats;
    tracker: Tracker;
  }
}

window.onload = (): void => {
  window.setTimeout(() => {
    window.existence = new Existence(1000000, true);
    window.existence.startLife();
  }, 3000);
  window.tracker = new Tracker();
  window.stats = stats;
};
