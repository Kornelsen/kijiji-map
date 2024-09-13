import type { TFilters } from "@/app/_types";
import { LngLatBounds } from "mapbox-gl";

export const initalBounds = new LngLatBounds([
  -79.46196298677538, 43.62623465357558, -79.34664605356505, 43.690946976992024,
]);

export const initialFilters: TFilters = {
  bounds: initalBounds,
  bedrooms: [],
  bathrooms: [],
  misc: [],
};
