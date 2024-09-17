export type ListingFeatureCollection = {
  type: "FeatureCollection";
  features: ListingFeature[];
};

export type ListingFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: ListingProperties;
};

export type SelectedListings = {
  points: ListingFeature[];
  coordinates: [number, number];
};

type ListingProperties = {
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
