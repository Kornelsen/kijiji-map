import type { MapRef } from "react-map-gl";
import type { GeoJSONPoint } from "@/app/_types";
import { Point } from "mapbox-gl";
import type {
  GeoJSONSource,
  MapboxGeoJSONFeature,
  Map as MapInstance,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export const getFeaturesAtCoordinates = (
  coordinates: [number, number],
  mapInstance: MapInstance
) => {
  const pointCoords = mapInstance.project(coordinates);
  const point = new Point(pointCoords.x, pointCoords.y);
  const features = mapInstance.queryRenderedFeatures(point, {
    layers: ["listings"],
  });

  return (
    features[0]?.properties?.listingId ||
    features[0]?.properties?.cluster_id ||
    ""
  );
};

export const getClusteredPoints = (
  clusterId: number,
  clusterSource: GeoJSONSource,
  callback: (points: GeoJSONPoint[]) => void
) => {
  clusterSource.getClusterLeaves(
    clusterId,
    Number.POSITIVE_INFINITY,
    0,
    (err, features) => {
      if (err) return console.error("Error fetching cluster leaves:", err);
      callback(features as GeoJSONPoint[]);
    }
  );
};

export const getFocusedListingId = (point: Point, map: MapRef | null) => {
  if (!map) return "";
  const features = map.queryRenderedFeatures(point, { layers: ["listings"] });

  const zoom = map.getZoom();
  const clusterPointCount = features[0]?.properties?.point_count;
  const showZoomCursor = clusterPointCount >= 10 && zoom < 15;

  map.getCanvas().style.cursor = showZoomCursor ? "zoom-in" : "pointer";
  return (
    features[0]?.properties?.listingId ||
    features[0]?.properties?.cluster_id ||
    ""
  );
};

export const shouldZoom = (
  mapInstance: MapInstance,
  features: MapboxGeoJSONFeature[]
) => {
  const zoom = mapInstance.getZoom();
  const clusterPointCount = features[0]?.properties?.point_count;
  const zoomIn = clusterPointCount >= 10 && zoom < 15;

  return zoomIn;
};
