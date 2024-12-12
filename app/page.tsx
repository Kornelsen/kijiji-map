import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { initialFilters } from "./constants";
import { getFeaturesData } from "./api/listings";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["features", encodeURIComponent(JSON.stringify(initialFilters))],
    queryFn: () =>
      getFeaturesData({
        filters: initialFilters,
      }),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Listings />
      </HydrationBoundary>
    </main>
  );
}
