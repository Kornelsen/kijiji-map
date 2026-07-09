import type { ListingFeatureCollection, TFilters } from "@/app/_types";
import { useFiltersStore } from "@/app/store";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getPaginatedListingsFilters,
  getPaginatedListingsQueryKey,
} from "./query-keys";

const getListings = async (filters: TFilters) => {
  const filtersParam = encodeURIComponent(JSON.stringify(filters));
  const uri = `${process.env.NEXT_PUBLIC_API_URI}listings?filters=${filtersParam}`;
  const resp = await fetch(uri, { cache: "no-store" });
  const result = await resp.json();
  return result;
};

export const usePaginatedListings = () => {
  const filters = useFiltersStore((state) => state.filters);
  return useQuery<ListingFeatureCollection>({
    queryKey: getPaginatedListingsQueryKey(filters),
    queryFn: () => getListings(getPaginatedListingsFilters(filters)),
    placeholderData: keepPreviousData,
  });
};
