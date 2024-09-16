import { Popup } from "react-map-gl";
import { ListingCard } from "../listings";
import type { TSelectedListings } from "@/app/_types";
import { useEffect } from "react";

type Props = {
  listing: TSelectedListings;
  onClose: () => void;
};

export const ListingPopup = ({ listing, onClose }: Props) => {
  useEffect(() => {
    console.log(listing.selectedListings[0].properties.listingId);
  }, [listing.selectedListings[0].properties.listingId]);

  return (
    <Popup
      anchor="top"
      longitude={listing.coordinates[1]}
      latitude={listing.coordinates[0]}
      onClose={onClose}
    >
      <div className="max-h-[200px] w-[415px] overflow-auto">
        <ListingCard listing={listing.selectedListings[0]} />
      </div>
    </Popup>
  );
};
