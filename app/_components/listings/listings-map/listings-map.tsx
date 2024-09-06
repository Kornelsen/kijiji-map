"use client";
import { useState } from "react";
import { MapProvider } from "react-map-gl";

import { useGlobalStore } from "@/app/store/global.store";
import { useListings } from "@/app/api/listings";
import type { Nullable, TListing } from "@/app/_types";
import { ListingPins } from "../listing-pins";
import { ListingPopup } from "../listing-popup";
import { Mapbox } from "../mapbox";

export const ListingsMap = () => {
  const { data: listings = [], isFetching } = useListings();
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
      <Mapbox loading={isFetching}>
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
