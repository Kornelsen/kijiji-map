import type { TFilters, TListing } from "@/app/_types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// TODO: rename this file

export const getListings = async (filters: TFilters) => {
  const filtersParam = encodeURIComponent(JSON.stringify(filters));
  const uri = `${process.env.NEXT_PUBLIC_API_URI}listings?filters=${filtersParam}`;
  const resp = await fetch(uri, { cache: "no-store" });
  const result = await resp.json();
  return result;
};

export const useListings = (filters: TFilters) => {
  return useQuery<TListing[]>({
    queryKey: ["listings", encodeURIComponent(JSON.stringify(filters))],
    queryFn: () => getListings(filters),
    placeholderData: keepPreviousData,
  });
};
