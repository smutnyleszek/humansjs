import climate from "./icons/climate.svg";
import cyclone from "./icons/cyclone.svg";
import drought from "./icons/drought.svg";
import earthquake from "./icons/earthquake.svg";
import flood from "./icons/flood.svg";
import ice from "./icons/ice.svg";
import meteor from "./icons/meteor.svg";
import plague from "./icons/plague.svg";
import religion from "./icons/religion.svg";
import volcano from "./icons/volcano.svg";
import war from "./icons/war.svg";

export const simulationYearTime = (1 / 8) * 1000;

export enum PopulationStatus {
  Extinct = "extinct",
  Safe = "safe",
  Struggling = "struggling",
}

export interface ICatastrophe {
  icon: string;
  isPersistent?: boolean;
  killMax: number;
  killMin: number;
  name: CatastropheName;
}

export const CatastrophePersistence: number = 50;

export enum CatastropheName {
  Climate = "climate-warming",
  Cyclone = "cyclone",
  Drought = "drought",
  Earthquake = "earthquake",
  Flood = "flood",
  Ice = "ice-age",
  Meteor = "meteor",
  Plague = "plague",
  Religion = "religion",
  Volcano = "volcano-eruption",
  War = "war",
}

export const Catastrophes: ICatastrophe[] = [
  {
    // http://www.impactlab.org/news-insights/valuing-climate-change-mortality/
    icon: climate,
    isPersistent: true,
    killMax: 17,
    killMin: 12,
    name: CatastropheName.Climate,
  },
  {
    icon: cyclone,
    killMax: 9,
    killMin: 9,
    name: CatastropheName.Cyclone,
  },
  {
    // https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll
    icon: drought,
    killMax: 28,
    killMin: 10,
    name: CatastropheName.Drought,
  },
  {
    // https://en.wikipedia.org/wiki/Lists_of_earthquakes
    icon: earthquake,
    killMax: 4,
    killMin: 2,
    name: CatastropheName.Earthquake,
  },
  {
    icon: flood,
    killMax: 6,
    killMin: 3,
    name: CatastropheName.Flood,
  },
  {
    icon: ice,
    isPersistent: true,
    killMax: 33,
    killMin: 11,
    name: CatastropheName.Ice,
  },
  {
    // https://en.wikipedia.org/wiki/Chicxulub_crater
    icon: meteor,
    killMax: 66,
    killMin: 4,
    name: CatastropheName.Meteor,
  },
  {
    // https://en.wikipedia.org/wiki/Black_Death
    // Black Death killed around 26% of world population
    icon: plague,
    isPersistent: true,
    killMax: 26,
    killMin: 4,
    name: CatastropheName.Plague,
  },
  {
    // https://rationalwiki.org/wiki/Death_toll_of_Christianity
    // https://en.wikipedia.org/wiki/Indigenous_peoples_of_the_Americas
    // https://en.wikipedia.org/wiki/Population_history_of_indigenous_peoples_of_the_Americas
    // Colonization killed as much as 80-90% of indigenous population
    // so I estimated it as 10% of world population and blame Christians
    icon: religion,
    isPersistent: true,
    killMax: 10,
    killMin: 2,
    name: CatastropheName.Religion,
  },
  {
    icon: volcano,
    killMax: 6,
    killMin: 4,
    name: CatastropheName.Volcano,
  },
  {
    // https://en.m.wikipedia.org/wiki/World_War_II_casualties
    // https://en.m.wikipedia.org/wiki/Atrocities_in_the_Congo_Free_State
    // WWII killed 3% of world population
    icon: war,
    isPersistent: true,
    killMax: 9,
    killMin: 3,
    name: CatastropheName.War,
  },
];

export function getCatastrophe(name: CatastropheName): ICatastrophe | null {
  return (
    Catastrophes.find((catastrophe) => {
      return catastrophe.name === name;
    }) || null
  );
}

export function isYearMillenium(year: number): boolean {
  if (year === 0) {
    return false;
  } else {
    return year % 1000 === 0;
  }
}
