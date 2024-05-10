"use client";
import {
	type LngLatBounds,
	Map as MapboxGL,
	type ViewStateChangeEvent,
	useMap,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader } from "../../shared/loader";

type Props = {
	children?: React.ReactNode;
	latitude?: number;
	longitude?: number;
	zoom?: number;
	loading?: boolean;
	onMoveEnd?: (bounds: LngLatBounds) => void;
};

// TODO: add a const for lat and lng
export const Mapbox = ({
	children,
	latitude = 43.6532,
	longitude = -79.3832,
	zoom = 12,
	loading,
	onMoveEnd,
}: Props) => {
	const map = useMap();

	return (
		<MapboxGL
			// TODO: use a private env variable for this
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
			initialViewState={{
				longitude,
				latitude,
				zoom,
			}}
			style={{ width: "100%", height: "100%" }}
			mapStyle="mapbox://styles/mapbox/streets-v11"
			onMoveEnd={(e: ViewStateChangeEvent) => {
				if (!map.default || !onMoveEnd) return;
				onMoveEnd(map.default.getBounds());
			}}
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
