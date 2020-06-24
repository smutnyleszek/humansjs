import { Existence } from "./existence";

window.onload = (): void => {
  window.setTimeout(() => {
    const humanExistence = new Existence(1000000, true);
    humanExistence.startLife();
  }, 1000);
};
