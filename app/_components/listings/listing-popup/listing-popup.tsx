import type { TListing } from "@/app/_types";
import { Popup } from "react-map-gl";
import { ListingDetails } from "../listing-details";
import { ListingImage } from "../listing-image";

type Props = {
	listing: TListing;
	onClose: () => void;
};

export const ListingPopup = ({ listing, onClose }: Props) => {
	return (
		<Popup
			anchor="top"
			longitude={listing.location.coordinates[0]}
			latitude={listing.location.coordinates[1]}
			onClose={onClose}
		>
			<div className="flex flex-col gap-3">
				<ListingImage height={192} width={200} images={listing.images} />
				<ListingDetails
					listing={listing}
					headingTextStyle="text-lg font-bold pt-2"
					bodyTextStyle="text-sm"
					captionTextStyle="test-xs"
				/>
			</div>
		</Popup>
	);
};
