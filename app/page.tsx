import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { initialFilters } from "./constants";
import { getFeaturesData, getFilters, getListingsData } from "./api/listings";
import {
  PAGE_SIZE,
  getFeaturesFilters,
  getFeaturesQueryKey,
  getPaginatedListingsFilters,
  getPaginatedListingsQueryKey,
} from "./hooks/query-keys";

// statically prerendered with baked listing data; keep it fresh-ish — the
// client still refetches on mount once staleTime lapses
export const revalidate = 300;

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getFeaturesQueryKey(initialFilters),
      queryFn: () =>
        getFeaturesData({
          filters: getFilters(getFeaturesFilters(initialFilters)),
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: getPaginatedListingsQueryKey(initialFilters),
      queryFn: () =>
        getListingsData({
          filters: getFilters(getPaginatedListingsFilters(initialFilters)),
          limit: PAGE_SIZE,
          skip: 0,
        }),
    }),
  ]);

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Listings />
      </HydrationBoundary>
    </main>
  );
}
