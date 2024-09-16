"use client";
import { useEffect, useRef } from "react";
import {
  Map as MapboxGL,
  useMap,
  type ViewStateChangeEvent,
  type MapRef,
} from "react-map-gl";
import { useFiltersStore, useGlobalStore } from "@/app/store";
import { initialFilters } from "@/app/constants";
import { Loader } from "../shared/loader";
import type { GeoJSONPoint, PointProperties } from "@/app/_types";
import type {
  Point,
  MapboxGeoJSONFeature,
  MapMouseEvent,
  GeoJSONSource,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  children?: React.ReactNode;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  loading?: boolean;
};

export const Mapbox = ({ children, loading }: Props) => {
  const map = useMap();
  const updateFilters = useFiltersStore((state) => state.updateFilters);

  const { setFocusedListing, setSelectedListings } = useGlobalStore(
    (state) => state
  );

  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (map.default) {
      map.default.on("mouseenter", "listings", (event) => {
        console.log(event);
        const listingId = getFocusedListingId(event.point, map.default);
        setFocusedListing(listingId);
      });
      map.default.on("mouseleave", "listings", () => {
        if (map.default) {
          map.default.getCanvas().style.cursor = "";
          setFocusedListing("");
        }
      });
    }
  }, [map, setFocusedListing]);

  const handleMoveEnd = (e: ViewStateChangeEvent) => {
    if (!map.default) return;
    updateFilters({ bounds: map.default.getBounds() });
  };

  const handleMapClick = (event: MapMouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const lngLat = map.unproject(event.point);

    const features = map.queryRenderedFeatures(event.point, {
      layers: ["listings"],
    });

    if (!features.length) {
      setSelectedListings(null);
      return;
    }

    const feature = features[0];
    const clusterId = feature.properties?.cluster_id;

    if (clusterId) {
      const clusterSource = map.getSource("point-source") as GeoJSONSource;
      getClusteredPoints(clusterId, clusterSource, (points: GeoJSONPoint[]) => {
        if (!points.length) setSelectedListings(null);
        else {
          setSelectedListings({
            points,
            coordinates: [event.lngLat.lat, event.lngLat.lng],
          });
        }
      });
    } else {
      setSelectedListings({
        points: [{ properties: feature.properties } as GeoJSONPoint],
        coordinates: [lngLat.lat, lngLat.lng],
      });
    }
  };

  return (
    <MapboxGL
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        bounds: initialFilters.bounds,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMoveEnd={handleMoveEnd}
      onClick={handleMapClick}
      ref={mapRef}
    >
      {loading && (
        <div className="absolute left-1/2 top-1/3 bg-white rounded p-2">
          <Loader />
        </div>
      )}
      {children}
    </MapboxGL>
  );
};

const getClusteredPoints = (
  clusterId: number,
  clusterSource: GeoJSONSource,
  callback: (points: GeoJSONPoint[]) => void
) => {
  clusterSource.getClusterLeaves(
    clusterId,
    Number.POSITIVE_INFINITY,
    0,
    (err, features) => {
      if (err) {
        console.error("Error fetching cluster leaves:", err);
        callback([]);
      }
      callback(features as GeoJSONPoint[]);
    }
  );
};
const getFocusedListingId = (point: Point, map?: MapRef) => {
  if (!map) return "";
  map.getCanvas().style.cursor = "pointer";
  const features = map.queryRenderedFeatures(point, {
    layers: ["listings"],
  });

  let listingId = "";

  console.log(features);

  if (features.length > 0) {
    const feature = features[0] as MapboxGeoJSONFeature;
    listingId = feature?.properties?.listingId ?? "";
  }

  return listingId;
};
