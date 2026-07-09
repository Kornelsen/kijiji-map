"use client";
import { useEffect, useRef, useCallback } from "react";
import type {
  Map,
  MapMouseEvent,
  GeoJSONSource,
  GeoJSONFeature,
} from "mapbox-gl";
import {
  Map as MapboxGL,
  useMap,
  type ViewStateChangeEvent,
  type MapRef,
} from "react-map-gl";
import { useFiltersStore, useGlobalStore } from "@/app/store";
import { initialViewBounds } from "@/app/constants";
import type { ListingFeature } from "@/app/_types";
import {
  getClusteredPoints,
  getFeaturesAtCoordinates,
  getFocusedListingId,
  shouldZoom,
} from "@/app/_utils/map";
import { LoaderOverlay } from "./loader-overlay";
import { getListingById } from "@/app/hooks/listings-by-id.query";
import { getQueryClient } from "@/app/providers";
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

  useEffect(() => {
    if (hoveredCardCoordinates && mapRef.current) {
      const features = getFeaturesAtCoordinates(
        hoveredCardCoordinates,
        mapRef.current.getMap()
      );
      setFocusedListing(features);
    }
  }, [hoveredCardCoordinates, setFocusedListing]);

  useEffect(() => {
    if (!map) return;

    const handleMouseEnter = async (event: MapMouseEvent) => {
      if (!mapRef.current) return;
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: ["listings"],
      });
      if (!features?.length) return;
      const mapInstance = mapRef.current.getMap();
      mapRef.current.getMap();
      const focusedListingId = getFocusedListingId(features, mapRef.current);
      const shouldPrefetch = !shouldZoom(mapInstance, features);

      if (shouldPrefetch) {
        prefetchListingData(features[0], mapInstance);
      }

      setFocusedListing(focusedListingId);
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
      const bounds = map.getBounds();
      if (!bounds) return;
      const { lng: swLng, lat: swLat } = bounds.getSouthWest();
      const { lng: neLng, lat: neLat } = bounds.getNorthEast();
      updateFilters({
        bounds: {
          _sw: { lng: swLng, lat: swLat },
          _ne: { lng: neLng, lat: neLat },
        },
      });
    },
    [map, updateFilters]
  );

  // tile fetch failures (token limits, transient 403s) surface here and are
  // recoverable — warn instead of react-map-gl's default console.error so the
  // dev overlay doesn't flag them as app errors
  const handleError = useCallback((e: { error?: Error }) => {
    console.warn("Map error:", e.error?.message ?? e.error);
  }, []);

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
        if (shouldZoom(mapInstance, features)) {
          mapInstance.flyTo({
            center: event.lngLat,
            zoom: mapInstance.getZoom() + 1,
          });
          return;
        }

        const clusterSource = mapInstance.getSource(
          "point-source"
        ) as GeoJSONSource;

        getClusteredPoints(clusterId, clusterSource, (points) =>
          setSelectedListings(
            points.length
              ? { points, coordinates: [event.lngLat.lat, event.lngLat.lng] }
              : null
          )
        );
      } else {
        const points = [
          {
            type: "Feature",
            properties: feature.properties,
            geometry: { type: "Point", coordinates },
          } as ListingFeature,
        ];
        setTimeout(() => setSelectedListings({ points, coordinates }), 0);
      }
    },
    [setSelectedListings]
  );

  return (
    <MapboxGL
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        bounds: [
          initialViewBounds._sw.lng,
          initialViewBounds._sw.lat,
          initialViewBounds._ne.lng,
          initialViewBounds._ne.lat,
        ],
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMoveEnd={handleMoveEnd}
      onClick={handleMapClick}
      onError={handleError}
      ref={mapRef}
    >
      {loading && <LoaderOverlay />}
      {children}
    </MapboxGL>
  );
};

const prefetchListingData = (feature: GeoJSONFeature, mapInstance: Map) => {
  const queryClient = getQueryClient();
  const clusterId = feature.properties?.cluster_id;
  const isCluster = !!clusterId;

  if (isCluster) {
    const clusterSource = mapInstance.getSource(
      "point-source"
    ) as GeoJSONSource;

    getClusteredPoints(clusterId, clusterSource, (points) => {
      for (let i = 0; i < points.length && i < 5; i++) {
        const id = points[i].properties?.listingId;
        if (queryClient.getQueryData(["listingById", id])) return;
        queryClient.prefetchQuery({
          queryKey: ["listingById", id],
          queryFn: () => getListingById(id),
        });
      }
    });
  } else {
    const id = feature.properties?.listingId;
    if (queryClient.getQueryData(["listingById", id])) return;
    queryClient.prefetchQuery({
      queryKey: ["listingById", id],
      queryFn: () => getListingById(id),
    });
  }
};
