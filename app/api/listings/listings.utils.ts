import type {
  ListingFeatureCollection,
  ListingFeature,
  TFilters,
} from "@/app/_types";
import type { Filter, Document } from "mongodb";
import mongoClient from "@/lib/mongodb";

export const getListingsData = async (
  filters: TFilters
): Promise<ListingFeatureCollection> => {
  try {
    const db = mongoClient.db("kijiji-map");

    const mongoFilters = getFilters(filters);

    const data = await db
      .collection("listing-features")
      .find<ListingFeature>(mongoFilters)
      .sort({ "properties.date": -1 })
      .project({
        _id: 0,
        "properties.attributes": 0,
        "properties.images": 0,
      })
      .toArray();

    return {
      type: "FeatureCollection",
      features: data as ListingFeature[],
    };
  } catch (error) {
    console.error("Error fetching listings data:", error);
    throw error;
  }
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
