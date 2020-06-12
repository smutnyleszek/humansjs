export interface ICatastrophe {
  name: CatastropheName;
  icon: string;
  killMin: number;
  killMax: number;
}

export enum PopulationStatus {
  Extinct = "extinct",
  Struggling = "struggling",
  Safe = "safe",
}

export enum CatastropheName {
  Climate = "climate-warming",
  Cyclone = "cyclone",
  Famine = "famine",
  Flood = "flood",
  Ice = "ice-age",
  Meteor = "meteor",
  Plague = "plague",
  Religion = "religion",
  Volcano = "volcano-eruption",
  War = "war",
  Wildfire = "wildfire",
}

export const CATASTROPHES: ICatastrophe[] = [
  // https://en.wikipedia.org/wiki/Chicxulub_crater
  { name: CatastropheName.Meteor, icon: "☄️", killMin: 0, killMax: 75 },
  // https://en.wikipedia.org/wiki/Black_Death
  { name: CatastropheName.Plague, icon: "🤢", killMin: 30, killMax: 60 },
  // https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll
  { name: CatastropheName.Famine, icon: "🏜", killMin: 10, killMax: 28 },
  { name: CatastropheName.Ice, icon: "🥶", killMin: 15, killMax: 20 },
  // http://www.impactlab.org/news-insights/valuing-climate-change-mortality/
  { name: CatastropheName.Climate, icon: "🌡️", killMin: 16, killMax: 19 },
  { name: CatastropheName.Flood, icon: "🌊", killMin: 3, killMax: 13 },
  { name: CatastropheName.Wildfire, icon: "🔥", killMin: 11, killMax: 12 },
  { name: CatastropheName.Volcano, icon: "🌋", killMin: 1, killMax: 9 },
  { name: CatastropheName.Cyclone, icon: "🌪", killMin: 6, killMax: 6 },
  // https://en.m.wikipedia.org/wiki/World_War_II_casualties
  { name: CatastropheName.War, icon: "⚔️", killMin: 2, killMax: 3 },
  // https://rationalwiki.org/wiki/Death_toll_of_Christianity
  { name: CatastropheName.Religion, icon: "🙏", killMin: 1, killMax: 2 },
];
