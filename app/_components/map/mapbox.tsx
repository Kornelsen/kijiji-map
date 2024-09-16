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
import type { GeoJSONPoint } from "@/app/_types";
import {
  Point,
  type MapboxGeoJSONFeature,
  type MapMouseEvent,
  type GeoJSONSource,
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

  const { hoveredCardCoordinates, setFocusedListing, setSelectedListings } =
    useGlobalStore((state) => state);

  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (!hoveredCardCoordinates || !mapRef.current) {
      setFocusedListing("");
      return;
    }

    const map = mapRef.current.getMap();
    const [longitude, latitude] = hoveredCardCoordinates;

    const projectedPoint = map.project([longitude, latitude]);
    const point = new Point(projectedPoint.x, projectedPoint.y);

    const features = map.queryRenderedFeatures(point, {
      layers: ["listings"],
    });

    setFocusedListing(
      features[0]?.properties?.listingId ??
        features[0]?.properties?.cluster_id ??
        ""
    );
  }, [hoveredCardCoordinates, setFocusedListing]);

  useEffect(() => {
    if (map.default) {
      map.default.on("mouseenter", "listings", (event) => {
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
  }, [map.default, setFocusedListing]);

  const handleMoveEnd = (e: ViewStateChangeEvent) => {
    if (!map.default) return;
    updateFilters({ bounds: map.default.getBounds() });
  };

  const handleMapClick = (event: MapMouseEvent) => {
    setSelectedListings(null);
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    const features = map.queryRenderedFeatures(event.point, {
      layers: ["listings"],
    });

    if (!features.length) {
      setSelectedListings(null);
      return;
    }

    const feature = features[0];
    const clusterId = feature.properties?.cluster_id;

    console.log(feature);

    const coordinates: [number, number] = [event.lngLat.lat, event.lngLat.lng];

    if (clusterId) {
      const clusterSource = map.getSource("point-source") as GeoJSONSource;
      getClusteredPoints(clusterId, clusterSource, (points: GeoJSONPoint[]) => {
        if (!points.length) setSelectedListings(null);
        else {
          setSelectedListings({
            points,
            coordinates,
          });
        }
      });
    } else {
      const points = [
        {
          type: "Feature",
          properties: feature.properties,
          geometry: {
            type: "Point",
            coordinates,
          },
        } as GeoJSONPoint,
      ];
      setTimeout(
        () =>
          setSelectedListings({
            points,
            coordinates,
          }),
        0
      );
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

  if (features.length > 0) {
    const feature = features[0] as MapboxGeoJSONFeature;
    listingId =
      feature.properties?.listingId ?? feature.properties?.cluster_id ?? "";
  }

  return listingId;
};
