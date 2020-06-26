import { Existence } from "./existence";
import { Tracker } from "./tracker";

window.onload = (): void => {
  window.setTimeout(() => {
    const humanExistence = new Existence(1000000, true);
    humanExistence.startLife();
  }, 1000);
  const tracker = new Tracker();
};
