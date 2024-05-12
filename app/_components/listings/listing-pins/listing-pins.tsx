import type { Nullable, TListing } from "@/app/_types";
import { Marker } from "react-map-gl";
import { Pin } from "../../shared";

type Props = {
	onPinClick: (marker: TListing) => void;
	listings?: TListing[];
	focusedListing: Nullable<string>;
};

export const ListingPins = ({
	listings,
	focusedListing,
	onPinClick,
}: Props) => {
	return listings?.map((listing) => {
		const focused = listing.listingId === focusedListing;
		return (
			<Marker
				key={`marker-${listing.listingId}`}
				longitude={listing.location.coordinates[0]}
				latitude={listing.location.coordinates[1]}
				anchor="bottom"
				onClick={(e) => {
					e.originalEvent.stopPropagation();
					onPinClick(listing);
				}}
				style={{ zIndex: focused ? 1 : 0 }}
			>
				<Pin focused={focused} />
			</Marker>
		);
	});
};
