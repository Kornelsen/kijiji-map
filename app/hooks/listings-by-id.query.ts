import type { ListingFeature } from "@/app/_types";
import { useQuery } from "@tanstack/react-query";

const getListingById = async (id: string) => {
  const uri = `${process.env.NEXT_PUBLIC_API_URI}listings/${id}`;
  const resp = await fetch(uri);
  const result = await resp.json();
  return result;
};

export const useListingById = (id: string) => {
  return useQuery<ListingFeature>({
    queryKey: ["listingsById", id],
    queryFn: () => getListingById(id),
  });
};
