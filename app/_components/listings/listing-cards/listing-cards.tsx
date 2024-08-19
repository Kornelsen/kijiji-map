import type { TListing } from "@/app/_types";
import { Card } from "../../shared/card";
import { ListingDetails } from "../listing-details";
import { ListingImage } from "../listing-image";

type Props = {
	listings?: TListing[];
	onFocus: (listingId: string) => void;
	onFocusEnd: () => void;
};

export const ListingCards = ({ listings, onFocus, onFocusEnd }: Props) => {
	return (
		<div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 items-stretch">
			{listings?.map((listing) => (
				<Card
					key={listing.listingId}
					className="p-0 pb-5 w-full h-full flex flex-col gap-3"
					onFocus={() => onFocus(listing.listingId)}
					onMouseEnter={() => onFocus(listing.listingId)}
					onMouseLeave={onFocusEnd}
				>
					<ListingImage height={288} width={400} images={listing.images} />
					<div className="px-5 h-full">
						<ListingDetails
							listing={listing}
							headingTextStyle="text-xl font-bold pt-2"
							bodyTextStyle="text-md"
							captionTextStyle="text-sm"
						/>
					</div>
				</Card>
			))}
		</div>
	);
};
