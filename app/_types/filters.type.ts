import type { LngLatBounds } from "mapbox-gl";
import type { Nullable } from "./utility.type";

export type TFilters = {
  bounds: LngLatBounds;
  price?: [Nullable<number>, Nullable<number>];
  sqft?: [Nullable<number>, Nullable<number>];
  bedrooms: number[];
  bathrooms: number[];
  misc: string[];
};
