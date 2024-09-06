"use client";
import { useState } from "react";
import { MapProvider } from "react-map-gl";

import type { Nullable, TListing } from "@/app/_types";
import { ListingPins } from "../listing-pins";
import { ListingPopup } from "../listing-popup";
import { Mapbox } from "../mapbox";
import { useGlobalStore } from "@/app/store/global.store";

type Props = {
  listings?: TListing[];
  loading?: boolean;
};

export const ListingsMap = ({ listings, loading }: Props) => {
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
      <Mapbox loading={loading}>
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
