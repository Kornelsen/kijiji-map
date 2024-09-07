import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { initialFilters } from "./constants";
import { getListingsData } from "./api/listings";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["listings", encodeURIComponent(JSON.stringify(initialFilters))],
    queryFn: () => getListingsData(initialFilters),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Listings />
      </HydrationBoundary>
    </main>
  );
}
