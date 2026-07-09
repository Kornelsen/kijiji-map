import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListingFeatureCollection, TFilters } from "../_types";
import { useFiltersStore } from "../store";
import { getFeaturesFilters, getFeaturesQueryKey } from "./query-keys";

const getFeatures = async (filters: TFilters) => {
  const filtersParam = encodeURIComponent(JSON.stringify(filters));
  const uri = `${process.env.NEXT_PUBLIC_API_URI}features?filters=${filtersParam}`;
  const resp = await fetch(uri);
  const result = await resp.json();
  return result;
};

export const useFeatures = () => {
  const filters = useFiltersStore((state) => state.filters);
  return useQuery<ListingFeatureCollection>({
    queryKey: getFeaturesQueryKey(filters),
    queryFn: () => getFeatures(getFeaturesFilters(filters)),
    placeholderData: keepPreviousData,
  });
};
