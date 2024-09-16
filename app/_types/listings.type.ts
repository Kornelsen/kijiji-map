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

// Define the GeoJSON types
export type GeoJSONPoint = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: PointProperties;
};

export type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONPoint[];
};

export type TSelectedListings = {
  selectedListings: GeoJSONPoint[];
  coordinates: [number, number];
};

export type PointProperties = {
  title: string;
  image: string;
  images: string[];
  address: string;
  date: Date;
  price: string;
  bedrooms: number;
  bathrooms: number;
  url: string;
  sqft?: number;
  attributes: Record<string, unknown>;
  listingId: string;
};
