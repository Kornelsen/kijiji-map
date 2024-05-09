import { LngLatBounds } from "mapbox-gl";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";

export const initalBounds = new LngLatBounds([
  -79.56567891588688, 43.57266292761034, -79.20072108688066, 43.734869536360236,
]);

export const getListings = async (bounds: LngLatBounds) => {
  const uri = `http://localhost:3000/api/listings?bounds=${bounds._sw.lng},${bounds._sw.lat},${bounds._ne.lng},${bounds._ne.lat}`;
  const resp = await fetch(uri);
  const result = await resp.json();
  return result;
};

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "listings",
      initalBounds._sw.lng,
      initalBounds._sw.lat,
      initalBounds._ne.lng,
      initalBounds._ne.lat,
    ],
    queryFn: () => getListings(initalBounds),
  });

  return (
    <main className="flex flex-col items-center justify-between ">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Listings />
      </HydrationBoundary>
    </main>
  );
}
