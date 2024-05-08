import { Popup } from "react-map-gl";
import { TListing } from "@/app/_types";
import { ListingDetails } from "../listing-details";

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
      <ListingDetails listing={listing} size="small" />
    </Popup>
  );
};
