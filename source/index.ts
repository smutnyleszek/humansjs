import { Existence } from "./existence";
import { Tracker } from "./tracker";

declare global {
  interface Window {
    existence: Existence;
    tracker: Tracker;
  }
}

window.onload = (): void => {
  window.setTimeout(() => {
    window.existence = new Existence(1000000, true);
    window.existence.startLife();
  }, 1000);
  window.tracker = new Tracker();
};
