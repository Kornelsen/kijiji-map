"use client";
import { Layer, MapProvider, Source } from "react-map-gl";

import { useGlobalStore } from "@/app/store/global.store";
import { useListings } from "@/app/hooks";
import { ListingPopup } from "./listing-popup";
import { Mapbox } from "./mapbox";
import type { GeoJSONFeatureCollection } from "@/app/_types";

export const ListingsMap = () => {
  const { data: listings = [], isFetching } = useListings();
  const { focusedListing, selectedListings, setSelectedListings } =
    useGlobalStore((state) => state);

  const handleClosePopup = () => {
    setSelectedListings(null);
  };

  return (
    <MapProvider>
      <Mapbox loading={isFetching}>
        <Source
          id="point-source"
          type="geojson"
          data={listings as GeoJSONFeatureCollection}
          cluster={true}
          clusterMaxZoom={25}
          clusterRadius={25}
        >
          <Layer
            id="listings"
            type="circle"
            paint={{
              "circle-radius": 15,
              "circle-color": [
                "case",
                ["==", ["get", "listingId"], focusedListing],
                "#6E66E6",
                ["==", ["get", "cluster_id"], focusedListing],
                "#6E66E6",
                "#373373",
              ],
              "circle-stroke-width": 3,
              "circle-stroke-color": "#fff",
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-size": 14,
            }}
            paint={{
              "text-color": "#fff",
            }}
          />
        </Source>
        {selectedListings && (
          <ListingPopup listing={selectedListings} onClose={handleClosePopup} />
        )}
      </Mapbox>
    </MapProvider>
  );
};
