import { useEffect } from "react";
import { Popup } from "react-map-gl";
import { ListingCard } from "../listings";
import type { TSelectedListings } from "@/app/_types";

type Props = {
  listing: TSelectedListings;
  onClose: () => void;
};

export const ListingPopup = ({ listing, onClose }: Props) => {
  useEffect(() => {
    console.log(listing.points[0].properties.listingId);
  }, [listing.points[0].properties.listingId]);

  return (
    <Popup
      anchor="top"
      longitude={listing.coordinates[1]}
      latitude={listing.coordinates[0]}
      onClose={onClose}
    >
      <div className="max-h-[200px] w-[415px] overflow-auto">
        <ListingCard listing={listing.points[0]} />
      </div>
    </Popup>
  );
};
