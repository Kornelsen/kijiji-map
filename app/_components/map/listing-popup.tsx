import { useMemo } from "react";
import { Popup } from "react-map-gl";
import { ListingCard } from "../listings";
import type { SelectedListings } from "@/app/_types";
import { Loader } from "../shared";
import { useListingById } from "@/app/hooks";

type Props = {
  listing: SelectedListings;
  onClose: () => void;
};

export const ListingPopup = ({ listing, onClose }: Props) => {
  const listingCards = useMemo(() => {
    return listing.points.map((listing) => (
      <PopupListingCard
        key={listing.properties.listingId}
        listingId={listing.properties.listingId}
      />
    ));
  }, [listing.points]);

  return (
    <Popup
      anchor="top"
      longitude={listing.coordinates[1]}
      latitude={listing.coordinates[0]}
      onClose={onClose}
      maxWidth="280px"
    >
      <div className="max-h-[250px] w-[260px] overflow-auto">
        {listingCards}
      </div>
    </Popup>
  );
};

const PopupListingCard = ({ listingId }: { listingId: string }) => {
  const { data: listing, isLoading } = useListingById(listingId);

  if (isLoading)
    return (
      <div className="m-auto">
        <Loader />
      </div>
    );
  if (!listing) return null;

  return <ListingCard listing={listing} compact />;
};
