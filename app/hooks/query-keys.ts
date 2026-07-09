import type { TFilters } from "@/app/_types";
import { initialFilterBounds } from "@/app/constants";

export const PAGE_SIZE = 10;

// The serialized filters double as the query key, so the SSR prefetch in
// app/page.tsx and the client hooks must build them identically — always
// derive both the key and the fetch params from these helpers.

export const getFeaturesFilters = (filters: TFilters): TFilters => {
  const { limit, skip, ...featureFilters } = filters;
  return { ...featureFilters, bounds: initialFilterBounds };
};

export const getFeaturesQueryKey = (filters: TFilters) => [
  "features",
  encodeURIComponent(JSON.stringify(getFeaturesFilters(filters))),
];

export const getPaginatedListingsFilters = (filters: TFilters): TFilters => ({
  ...filters,
  limit: PAGE_SIZE,
});

export const getPaginatedListingsQueryKey = (filters: TFilters) => [
  "paginated-listings",
  encodeURIComponent(JSON.stringify(getPaginatedListingsFilters(filters))),
];
