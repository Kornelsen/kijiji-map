import type { TListing } from "@/app/_types";
import { formatAddress } from "@/app/_utils/string";
import { Button } from "../../shared";

type Props = {
	listing: TListing;
	headingTextStyle: string;
	bodyTextStyle: string;
	captionTextStyle: string;
};

export const ListingDetails = ({
	listing,
	headingTextStyle,
	bodyTextStyle,
	captionTextStyle,
}: Props) => {
	return (
		<div className="flex flex-col gap-2">
			<h2 className={headingTextStyle}>${listing.price}</h2>
			<p className={bodyTextStyle}>{formatAddress(listing.address)}</p>
			<p className={captionTextStyle}>{`${listing.bedrooms ?? "?"} Beds • ${
				listing.bathrooms ?? "?"
			} Baths${listing.sqft ? ` • ${listing.sqft} sqft` : ""}`}</p>
			<a
				href={listing.url}
				target="_blank"
				rel="noreferrer"
				className="mt-auto"
			>
				<Button>View Listing</Button>
			</a>
		</div>
	);
};
