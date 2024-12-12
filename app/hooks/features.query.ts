import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useFiltersStore } from "../store";
import { initialFilterBounds } from "../constants";
import type { ListingFeatureCollection, TFilters } from "../_types";

const getFeatures = async (filters: TFilters) => {
  const filtersParam = encodeURIComponent(JSON.stringify(filters));
  const uri = `${process.env.NEXT_PUBLIC_API_URI}features?filters=${filtersParam}`;
  const resp = await fetch(uri, { next: { revalidate: 36000 } });
  const result = await resp.json();
  return result;
};

export const useFeatures = () => {
  const { limit, skip, ...filters } = useFiltersStore((state) => state.filters);
  filters.bounds = initialFilterBounds;
  return useQuery<ListingFeatureCollection>({
    queryKey: ["features", encodeURIComponent(JSON.stringify(filters))],
    queryFn: () => getFeatures(filters),
    placeholderData: keepPreviousData,
  });
};
