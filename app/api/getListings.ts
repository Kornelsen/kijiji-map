import { useQuery } from "@tanstack/react-query";
import { Ad } from "kijiji-scraper";

type Params = {
  categoryId: number;
  locationId: number;
};

const getListings = async (filters: Params): Promise<Ad[]> => {
  // TODO: use env var for api url
  const resp = await fetch("http://localhost:3000/api", {
    method: "POST",
    body: JSON.stringify(filters),
  });
  const x = await resp.json();
  return x;
};

export const useListings = ({ categoryId, locationId }: Params) =>
  useQuery({
    queryKey: ["listings", locationId, categoryId],
    queryFn: () => getListings({ categoryId, locationId }),
  });
