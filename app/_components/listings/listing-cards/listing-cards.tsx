import type { TListing } from "@/app/_types";
import { ListingCard } from "../listing-card/listing-card";
import { useEffect, useState } from "react";
import { Card, PaginationControl } from "../../shared";

type Props = {
	listings?: TListing[];
	onFocus: (listingId: string) => void;
	onFocusEnd: () => void;
};

const ITEMS_PER_PAGE = 10;

export const ListingCards = ({ listings, onFocus, onFocusEnd }: Props) => {
	const [page, setPage] = useState(0);
	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset page when listings updated
	useEffect(() => {
		setPage(0);
	}, [listings]);

	const totalPages = Math.ceil((listings?.length || 0) / ITEMS_PER_PAGE);
	const listingsToDisplay = listings?.slice(
		page * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
	);

	return (
		<div className="grid grid-cols-1 gap-3">
			{listingsToDisplay?.map((listing) => (
				<ListingCard
					key={listing.listingId}
					listing={listing}
					onFocus={onFocus}
					onFocusEnd={onFocusEnd}
				/>
			))}
			<Card className="p-3 sticky">
				<PaginationControl
					page={page}
					totalPages={totalPages}
					handlePageChange={handlePageChange}
				/>
			</Card>
		</div>
	);
};
