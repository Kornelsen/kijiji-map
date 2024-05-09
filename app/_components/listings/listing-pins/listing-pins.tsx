import { Marker } from "react-map-gl";
import { TListing } from "@/app/_types";
import { Pin } from "../pin";

type Props = {
  onPinClick: (marker: TListing) => void;
  listings?: TListing[];
};

export const ListingPins = ({ listings, onPinClick }: Props) => {
  return listings?.map((listing, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={listing.location.coordinates[0]}
      latitude={listing.location.coordinates[1]}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onPinClick(listing);
      }}
    >
      <Pin />
    </Marker>
  ));
};
