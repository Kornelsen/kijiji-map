"use client";
import { useEffect, useRef, useCallback } from "react";
import type { MapMouseEvent, GeoJSONSource } from "mapbox-gl";
import {
  Map as MapboxGL,
  useMap,
  type ViewStateChangeEvent,
  type MapRef,
} from "react-map-gl";
import { useFiltersStore, useGlobalStore } from "@/app/store";
import { initialFilters } from "@/app/constants";
import type { ListingFeature } from "@/app/_types";
import {
  getClusteredPoints,
  getFeaturesAtCoordinates,
  getFocusedListingId,
  shouldZoom,
} from "@/app/_utils/map";
import { LoaderOverlay } from "./loader-overlay";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
};

export const Mapbox = ({ children, loading }: Props) => {
  const { default: map } = useMap();
  const updateFilters = useFiltersStore((state) => state.updateFilters);
  const { hoveredCardCoordinates, setFocusedListing, setSelectedListings } =
    useGlobalStore();

  const mapRef = useRef<MapRef | null>(null);

  const projectPoint = useCallback(() => {
    if (!hoveredCardCoordinates || !mapRef.current) return;

    const features = getFeaturesAtCoordinates(
      hoveredCardCoordinates,
      mapRef.current.getMap(),
    );
    setFocusedListing(features);
  }, [hoveredCardCoordinates, setFocusedListing]);

  useEffect(() => {
    projectPoint();
  }, [projectPoint]);

  useEffect(() => {
    if (!map) return;

    const handleMouseEnter = (event: MapMouseEvent) => {
      setFocusedListing(getFocusedListingId(event.point, mapRef.current));
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setFocusedListing("");
    };

    map.on("mouseenter", "listings", handleMouseEnter);
    map.on("mouseleave", "listings", handleMouseLeave);

    return () => {
      map.off("mouseenter", "listings", handleMouseEnter);
      map.off("mouseleave", "listings", handleMouseLeave);
    };
  }, [map, setFocusedListing]);

  const handleMoveEnd = useCallback(
    (e: ViewStateChangeEvent) => {
      if (!map) return;
      updateFilters({ bounds: map.getBounds() });
    },
    [map, updateFilters],
  );

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      if (!mapRef.current) return;
      setSelectedListings(null);

      const mapInstance = mapRef.current.getMap();
      const features = mapInstance.queryRenderedFeatures(event.point, {
        layers: ["listings"],
      });

      if (!features.length) return;

      const feature = features[0];
      const clusterId = feature.properties?.cluster_id;
      const isCluster = !!clusterId;

      const coordinates: [number, number] = [
        event.lngLat.lat,
        event.lngLat.lng,
      ];

      if (isCluster) {
        const clusterSource = mapInstance.getSource(
          "point-source",
        ) as GeoJSONSource;

        if (shouldZoom(mapInstance, features)) {
          mapInstance.flyTo({
            center: event.lngLat,
            zoom: mapInstance.getZoom() + 1,
          });
          return;
        }
        getClusteredPoints(clusterId, clusterSource, (points) =>
          setSelectedListings(
            points.length
              ? { points, coordinates: [event.lngLat.lat, event.lngLat.lng] }
              : null,
          ),
        );
      } else {
        const points = [
          {
            type: "Feature",
            properties: feature.properties,
            geometry: { type: "Point", coordinates },
          } as ListingFeature,
        ];
        setSelectedListings({ points, coordinates });
      }
    },
    [setSelectedListings],
  );

  return (
    <MapboxGL
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ bounds: initialFilters.bounds }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMoveEnd={handleMoveEnd}
      onClick={handleMapClick}
      ref={mapRef}
    >
      {loading && <LoaderOverlay />}
      {children}
    </MapboxGL>
  );
};
