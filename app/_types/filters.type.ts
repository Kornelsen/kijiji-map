import type { Nullable } from "./utility.type";

// Matches the JSON shape of mapbox-gl's LngLatBounds so serialized filters are
// identical whether bounds come from constants or map.getBounds()
export type TBounds = {
  _sw: { lng: number; lat: number };
  _ne: { lng: number; lat: number };
};

export type TFilters = {
  bounds: TBounds;
  price?: [Nullable<number>, Nullable<number>];
  sqft?: [Nullable<number>, Nullable<number>];
  bedrooms: number[];
  bathrooms: number[];
  misc: string[];
  skip?: number;
  limit?: number;
};
