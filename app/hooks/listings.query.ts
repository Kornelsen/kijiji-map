import type { ListingFeatureCollection, TFilters } from "@/app/_types";
import { useFiltersStore } from "@/app/store";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const PAGE_SIZE = 10;

const getListings = async (filters: TFilters) => {
  const filtersParam = encodeURIComponent(JSON.stringify(filters));
  const uri = `${process.env.NEXT_PUBLIC_API_URI}listings?filters=${filtersParam}`;
  const resp = await fetch(uri, { cache: "no-store" });
  const result = await resp.json();
  return result;
};

export const usePaginatedListings = () => {
  const filters = useFiltersStore((state) => state.filters);
  filters.limit = PAGE_SIZE;
  return useQuery<ListingFeatureCollection>({
    queryKey: [
      "paginated-listings",
      encodeURIComponent(JSON.stringify(filters)),
    ],
    queryFn: () => getListings(filters),
    placeholderData: keepPreviousData,
  });
};
