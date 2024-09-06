import type { TFilters, TListing } from "@/app/_types";
import { useFiltersStore } from "@/app/store";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const getListings = async (filters: TFilters) => {
  const filtersParam = encodeURIComponent(JSON.stringify(filters));
  const uri = `${process.env.NEXT_PUBLIC_API_URI}listings?filters=${filtersParam}`;
  const resp = await fetch(uri, { cache: "no-store" });
  const result = await resp.json();
  return result;
};

export const useListings = () => {
  const filters = useFiltersStore((state) => state.filters);
  return useQuery<TListing[]>({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
    placeholderData: keepPreviousData,
  });
};
