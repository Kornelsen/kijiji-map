import { LngLatBounds } from "mapbox-gl";
import { Nullable } from "./utility";

// TODO: rename this file
// TODO: rename this, it exists already in the kijiji scraper library
export type TScraperOptions = {
  id: number;
  [key: string]: TScraperOptions | number;
};

export type TListing = {
  title: string;
  image: string;
  images: string[];
  address: string;
  date: Date;
  location: {
    coordinates: [number, number];
    type: "Point";
  };
  price: string;
  bedrooms: number;
  bathrooms: number;
  url: string;
  sqft?: number;
  attributes: Record<string, unknown>;
  listingId: string;
};

export type TFilters = {
  bounds: LngLatBounds;
  locationId?: number;
  categoryId?: number;
  minPrice?: Nullable<number>;
  maxPrice?: Nullable<number>;
  minSqft?: number;
  maxSqft?: number;
  bedrooms: number[];
  bathrooms: number[];
  misc: string[];
};

export type TInput<T> = {
  name: string;
  value: T;
};
