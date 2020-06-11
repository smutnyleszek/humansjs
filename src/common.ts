export interface ICatastrophe {
  type: CatastropheType;
  killMin: number;
  killMax: number;
}

export enum PopulationStatus {
  Extinct = "extinct",
  Struggling = "struggling",
  Safe = "safe",
}

export enum CatastropheType {
  ClimateWarming = "🌡️",
  Cyclone = "🌪",
  Famine = "🏜",
  Flood = "🌊",
  IceAge = "🥶",
  Meteor = "☄️",
  Plague = "🤢",
  Religion = "🙏",
  VolcanoEruption = "🌋",
  War = "⚔️",
  Wildfire = "🔥",
}

export const CATASTROPHES: ICatastrophe[] = [
  // https://en.wikipedia.org/wiki/Chicxulub_crater
  { type: CatastropheType.Meteor, killMin: 0, killMax: 75 },
  // https://en.wikipedia.org/wiki/Black_Death
  { type: CatastropheType.Plague, killMin: 30, killMax: 60 },
  // https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll
  { type: CatastropheType.Famine, killMin: 10, killMax: 28 },
  { type: CatastropheType.IceAge, killMin: 15, killMax: 20 },
  // http://www.impactlab.org/news-insights/valuing-climate-change-mortality/
  { type: CatastropheType.ClimateWarming, killMin: 16, killMax: 19 },
  { type: CatastropheType.Flood, killMin: 3, killMax: 13 },
  { type: CatastropheType.Wildfire, killMin: 11, killMax: 12 },
  { type: CatastropheType.VolcanoEruption, killMin: 1, killMax: 9 },
  { type: CatastropheType.Cyclone, killMin: 6, killMax: 6 },
  // https://en.m.wikipedia.org/wiki/World_War_II_casualties
  { type: CatastropheType.War, killMin: 2, killMax: 3 },
  // https://rationalwiki.org/wiki/Death_toll_of_Christianity
  { type: CatastropheType.Religion, killMin: 1, killMax: 2 },
];
