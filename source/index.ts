import { Existence } from "./existence";

window.onload = (): void => {
  const humanExistence = new Existence(1000000, true);
  humanExistence.startLife();
};
