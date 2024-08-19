import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { Listings } from "./_components/listings";
import { getListings, initialFilters } from "./api/listings";

export default async function Home() {
	const queryClient = new QueryClient();

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
