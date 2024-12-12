import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { initialFilters } from "./constants";
import { getFeaturesData, getListingsData } from "./api/listings";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["features", encodeURIComponent(JSON.stringify(initialFilters))],
    queryFn: () =>
      getFeaturesData({
        filters: initialFilters,
      }),
  });

  // TODO: use const for the limit value
  const initialListingFilters = { ...initialFilters, limit: 10 };

  await queryClient.prefetchQuery({
    queryKey: [
      "paginated-listings",
      encodeURIComponent(JSON.stringify(initialListingFilters)),
    ],
    queryFn: () => getListingsData({ filters: initialListingFilters }),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Listings />
      </HydrationBoundary>
    </main>
  );
}
