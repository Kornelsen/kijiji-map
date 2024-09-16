import type {
  GeoJSONFeatureCollection,
  GeoJSONPoint,
  TFilters,
  TListing,
} from "@/app/_types";
import type { Ad } from "kijiji-scraper";
import type { Filter, Document } from "mongodb";
import mongoClient from "@/lib/mongodb";

export const getListingsData = async (
  filters: TFilters
): Promise<GeoJSONFeatureCollection> => {
  try {
    const db = mongoClient.db("kijiji-map");

    const mongoFilters = getFilters(filters);

    const data = await db
      .collection("listing-features")
      .find<GeoJSONPoint>(mongoFilters)
      .sort({ date: -1 })
      .project({
        attributes: 0,
        images: 0,
      })
      .toArray();

    return {
      type: "FeatureCollection",
      features: data as GeoJSONPoint[],
    };
  } catch (error) {
    console.error("Error fetching listings data:", error);
    throw error;
  }
};

// The function to convert TListing array to GeoJSON FeatureCollection
export function convertToGeoJSON(
  listings: TListing[]
): GeoJSONFeatureCollection {
  const features: GeoJSONPoint[] = listings.map((listing) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: listing.location.coordinates,
    },
    properties: {
      title: listing.title,
      image: listing.image,
      images: listing.images,
      address: listing.address,
      date: listing.date,
      price: listing.price,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      url: listing.url,
      sqft: listing.sqft,
      attributes: listing.attributes,
      listingId: listing.listingId,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

export const mapToListing = (ad: Ad) => {
  return {
    listingId: ad.id,
    title: ad.title,
    image: ad.image,
    images: ad.images,
    address: ad.attributes.location.mapAddress,
    date: ad.date,
    location: {
      coordinates: [
        ad.attributes.location.longitude,
        ad.attributes.location.latitude,
      ],
      type: "Point",
    },
    price: ad.attributes.price,
    bedrooms: ad.attributes.numberbedrooms,
    bathrooms: ad.attributes.numberbathrooms,
    url: ad.url,
    sqft: ad.attributes.areainfeet,
    attributes: ad.attributes,
  } as TListing;
};

export const getFilters = ({
  bounds,
  bedrooms,
  bathrooms,
  price,
  sqft,
  misc,
}: TFilters): Filter<Document> => {
  const filters: Filter<Document> = { $and: [] };

  if (bounds) {
    filters.$and?.push({
      "geometry.coordinates": {
        $geoWithin: {
          $box: [
            [bounds._sw.lng, bounds._sw.lat],
            [bounds._ne.lng, bounds._ne.lat],
          ],
        },
      },
    });
  }

  if (price) {
    if (price[0]) filters.$and?.push({ "properties.price": { $gt: price[0] } });
    if (price[1]) filters.$and?.push({ "properties.price": { $lt: price[1] } });
  }

  if (sqft) {
    if (sqft[0]) filters.$and?.push({ "properties.sqft": { $gt: sqft[0] } });
    if (sqft[1]) filters.$and?.push({ "properties.sqft": { $lt: sqft[1] } });
  }

  if (bedrooms?.length) {
    const bedroomFilters = bedrooms.map((bedroom) =>
      bedroom === 4
        ? { "properties.bedrooms": { $gte: 4 } }
        : { "properties.bedrooms": bedroom }
    );
    filters.$and?.push({ $or: bedroomFilters });
  }

  if (bathrooms?.length) {
    const bathroomFilters = bathrooms.map((bathroom) =>
      bathroom === 4
        ? { "properties.bathrooms": { $gte: 4 } }
        : { "properties.bathrooms": bathroom }
    );
    filters.$and?.push({ $or: bathroomFilters });
  }

  if (misc?.length) {
    for (const miscFilter of misc) {
      filters.$and?.push({
        [`properties.attributes.${miscFilter}`]: {
          $exists: true,
          $nin: [false, 0, ""],
        },
      });
    }
  }

  return filters;
};
