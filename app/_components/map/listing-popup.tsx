import { useMemo } from "react";
import { Popup } from "react-map-gl";
import { ListingCard } from "../listings";
import type { TSelectedListings } from "@/app/_types";

type Props = {
  listing: TSelectedListings;
  onClose: () => void;
};

export const ListingPopup = ({ listing, onClose }: Props) => {
  const listingCards = useMemo(() => {
    return listing.points.map((listing) => (
      <ListingCard key={listing.properties.listingId} listing={listing} />
    ));
  }, [listing.points]);

  return (
    <Popup
      anchor="top"
      longitude={listing.coordinates[1]}
      latitude={listing.coordinates[0]}
      onClose={onClose}
    >
      <div className="max-h-[200px] w-[415px] overflow-auto">
        {listingCards}
      </div>
    </Popup>
  );
};
