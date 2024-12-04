import type { TFilters } from "@/app/_types";
import { LngLatBounds } from "mapbox-gl";

export const initialViewBounds = new LngLatBounds([
  -79.46196298677538, 43.62623465357558, -79.34664605356505, 43.690946976992024,
]);

export const initialFilterBounds = new LngLatBounds([
  -79.7542010370357, 43.50730919334225, -79.03372591269951, 43.96666286922914,
]);

export const initialFilters: TFilters = {
  bounds: initialViewBounds,
  bedrooms: [],
  bathrooms: [],
  misc: [],
};
