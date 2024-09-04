import type { TListing } from "@/app/_types";
import { Popup } from "react-map-gl";
import { ListingCard } from "../listing-card/listing-card";

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
      <ListingCard listing={listing} onFocus={() => {}} onFocusEnd={() => {}} />
    </Popup>
  );
};
