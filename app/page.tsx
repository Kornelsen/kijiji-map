import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { getListings, initalBounds } from "./api/listings";

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
