"use client";
import { useState } from "react";
import { LngLatBounds, MapProvider } from "react-map-gl";

import { Nullable, TListing } from "@/app/_types";
import { Mapbox } from "../mapbox";
import { ListingPins } from "../listing-pins";
import { ListingPopup } from "../listing-popup";

type Props = {
  onMoveEnd: (bounds: LngLatBounds) => void;
  listings?: TListing[];
  loading?: boolean;
};

export const ListingsMap = ({ listings, loading, onMoveEnd }: Props) => {
  const [selected, setSelected] = useState<Nullable<TListing>>(null);

  const handlePinClick = (listing: TListing) => {
    setSelected(listing);
  };

  const handleClosePopup = () => {
    setSelected(null);
  };

  return (
    <MapProvider>
      <Mapbox onMoveEnd={onMoveEnd} loading={loading}>
        <ListingPins listings={listings} onPinClick={handlePinClick} />
        {selected && (
          <ListingPopup listing={selected} onClose={handleClosePopup} />
        )}
      </Mapbox>
    </MapProvider>
  );
};
