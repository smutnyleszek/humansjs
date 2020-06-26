import { ICatastrophe, PopulationStatus } from "./common";

interface ICatastropheIncidentData {
  catastrophe: ICatastrophe | null;
  year: number;
}

interface IGameOverIncidentData {
  status: PopulationStatus;
  year: number;
}

interface IPopulationIncidentData {
  count: number;
}

export enum IncidentName {
  Catastrophe = "catastrophe-occurred",
  GameOver = "game-over",
  Population = "total-population-count-changed",
}

type IncidentData =
  | ICatastropheIncidentData
  | IGameOverIncidentData
  | IPopulationIncidentData;

export function listen(name: IncidentName, callback: any): () => void {
  document.addEventListener(name, callback);
  // return cancel function
  return () => {
    document.removeEventListener(name, callback);
  };
}

export function publish(name: IncidentName, data: IncidentData) {
  document.dispatchEvent(
    new CustomEvent<IncidentData>(name, { detail: data })
  );
}
