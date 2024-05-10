import type { TFilters } from "@/app/_types";
import { LngLatBounds } from "mapbox-gl";

const initalBounds = new LngLatBounds([
	-79.56567891588688, 43.57266292761034, -79.20072108688066, 43.734869536360236,
]);

export const initialFilters: TFilters = {
	bounds: initalBounds,
	minPrice: null,
	maxPrice: null,
	bedrooms: [],
	bathrooms: [],
	misc: [],
};
