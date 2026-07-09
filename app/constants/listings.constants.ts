import type { TBounds, TFilters } from "@/app/_types";

export const initialViewBounds: TBounds = {
  _sw: { lng: -79.46196298677538, lat: 43.62623465357558 },
  _ne: { lng: -79.34664605356505, lat: 43.690946976992024 },
};

export const initialFilterBounds: TBounds = {
  _sw: { lng: -79.7542010370357, lat: 43.50730919334225 },
  _ne: { lng: -79.03372591269951, lat: 43.96666286922914 },
};

export const initialFilters: TFilters = {
  bounds: initialViewBounds,
  bedrooms: [],
  bathrooms: [],
  misc: [],
};
