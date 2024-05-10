import type { LngLatBounds } from "mapbox-gl";
import type { Nullable } from "./utility";

export type TFilters = {
	bounds: LngLatBounds;
	minPrice?: Nullable<number>;
	maxPrice?: Nullable<number>;
	minSqft?: number;
	maxSqft?: number;
	bedrooms: number[];
	bathrooms: number[];
	misc: string[];
};
