"use client";

import { useState } from "react";
import type { LngLatBounds } from "react-map-gl";
import { useDebouncedCallback } from "use-debounce";
import type { Nullable, TFilters, TInput } from "@/app/_types";
import { initialFilters, useListings } from "@/app/api/listings";

import { Card } from "../shared/card";
import { Filters } from "./filters";
import { ListingCards } from "./listing-cards";
import { ListingsMap } from "./listings-map";
import { ScrapeButton } from "./scrape-button";

export const Listings = () => {
	const [filters, setFilters] = useState<TFilters>(initialFilters);
	const [focusedListing, setFocusedListing] = useState<Nullable<string>>(null);

	const { data: listings = [], isFetching } = useListings(filters);

	const handleFilterChange = useDebouncedCallback(
		({ name, value }: TInput<unknown>) =>
			setFilters((prev) => ({ ...prev, [name]: value })),
		500,
	);

	const handleMoveEnd = (bounds: LngLatBounds) => {
		setFilters((prev) => ({ ...prev, bounds }));
	};

	return (
		<div className="flex flex-row h-screen w-full overflow-hidden">
			<div className="flex flex-col gap-3 py-3 px-3 overflow-y-auto w-[450px]">
				<Card className="p-4 flex flex-col gap-2">
					<div className="flex flex-col justify-between">
						<h1 className="text-2xl font-bold">Toronto Rentals</h1>
						<p className="font-semibold">{listings.length} Listings</p>
					</div>
					<Filters
						initialFilters={initialFilters}
						onChange={handleFilterChange}
					/>
				</Card>
				<ListingCards
					listings={listings}
					onFocus={setFocusedListing}
					onFocusEnd={() => setFocusedListing(null)}
				/>
			</div>
			<div className="flex grow">
				<ListingsMap
					listings={listings}
					loading={isFetching}
					focusedListing={focusedListing}
					onMoveEnd={handleMoveEnd}
				/>
			</div>
		</div>
	);
};
