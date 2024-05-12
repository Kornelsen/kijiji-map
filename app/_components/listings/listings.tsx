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
		({ name, value }: TInput<unknown>) => {
			setFilters({ ...filters, [name]: value });
		},
		500,
	);

	const handleMoveEnd = async (bounds: LngLatBounds) => {
		setFilters({ ...filters, bounds });
	};

	const handleMouseEnterCard = (listingId: string) => {
		setFocusedListing(listingId);
	};

	const handleMouseLeaveCard = () => {
		setFocusedListing(null);
	};

	return (
		<div className="flex flex-row h-screen w-full">
			<div className="flex flex-col gap-4 p-5 overflow-y-auto w-[340px] 2xl:w-[650px]">
				{/* <ScrapeButton /> */}
				<Card className="p-5 flex flex-col gap-2">
					<div className="flex items-end justify-between">
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
					onFocus={handleMouseEnterCard}
					onFocusEnd={handleMouseLeaveCard}
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
