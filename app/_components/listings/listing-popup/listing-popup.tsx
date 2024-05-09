import { Popup } from "react-map-gl";
import { TListing } from "@/app/_types";
import { Listing } from "../listing";

type Props = {
  listing: TListing;
  onClose: () => void;
};

export const ListingPopup = ({ listing, onClose }: Props) => {
  return (
    <Popup
      anchor="top"
      longitude={Number(listing.location.coordinates[0])}
      latitude={Number(listing.location.coordinates[1])}
      onClose={onClose}
      className="flex text-black p-0"
    >
      <Listing
        listing={listing}
        headingStyle="text-lg font-bold pt-2"
        bodyStyle="text-sm"
        captionStyle="text-xs"
        imageHeight={192}
        imageWidth={200}
      />
    </Popup>
  );
};
