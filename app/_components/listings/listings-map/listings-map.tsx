"use client";
import { useState } from "react";
import { type LngLatBounds, MapProvider } from "react-map-gl";

import type { Nullable, TListing } from "@/app/_types";
import { ListingPins } from "../listing-pins";
import { ListingPopup } from "../listing-popup";
import { Mapbox } from "../mapbox";
import { useGlobalStore } from "@/app/store/global.store";

type Props = {
  onMoveEnd: (bounds: LngLatBounds) => void;
  listings?: TListing[];
  loading?: boolean;
};

export const ListingsMap = ({ listings, loading, onMoveEnd }: Props) => {
  const focusedListing = useGlobalStore((state) => state.focusedListing);

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
        <ListingPins
          listings={listings}
          onPinClick={handlePinClick}
          focusedListing={focusedListing}
        />
        {selected && (
          <ListingPopup listing={selected} onClose={handleClosePopup} />
        )}
      </Mapbox>
    </MapProvider>
  );
};
