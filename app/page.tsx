import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  isServer,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { getListings, initialFilters } from "./api/listings";

export default async function Home() {
  const queryClient = new QueryClient();

  console.log("this is the server", isServer);

  await queryClient.prefetchQuery({
    queryKey: ["listings", encodeURIComponent(JSON.stringify(initialFilters))],
    queryFn: () => getListings(initialFilters),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Listings />
      </HydrationBoundary>
    </main>
  );
}
