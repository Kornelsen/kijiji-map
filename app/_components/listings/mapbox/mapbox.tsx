"use client";
import {
  Map as MapboxGL,
  type ViewStateChangeEvent,
  useMap,
} from "react-map-gl";
import { useFiltersStore } from "@/app/store";
import { initialFilters } from "@/app/constants";
import { Loader } from "../../shared/loader";
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

  const handleMoveEnd = (e: ViewStateChangeEvent) => {
    if (!map.default) return;
    updateFilters({ bounds: map.default.getBounds() });
  };

  return (
    <MapboxGL
      // TODO: use a private env variable for this
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        bounds: initialFilters.bounds,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMoveEnd={handleMoveEnd}
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
