import type { TFilters, TListing } from "@/app/_types";
import type { Ad } from "kijiji-scraper";
import type { Filter, Document } from "mongodb";
import mongoClient from "@/lib/mongodb";

export const getListingsData = async (
  filters: TFilters,
): Promise<TListing[]> => {
  try {
    const db = mongoClient.db("kijiji-map");

    const mongoFilters = getFilters(filters);

    const data = await db
      .collection("listings")
      .find<TListing>(mongoFilters)
      .sort({ date: -1 })
      .project({
        attributes: 0,
        images: 0,
      })
      .toArray();

    return data as TListing[];
  } catch (error) {
    console.error("Error fetching listings data:", error);
    throw error;
  }
};

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
  if (bounds)
    filters.$and?.push({
      location: {
        $geoWithin: {
          $box: [
            [bounds._sw.lng, bounds._sw.lat],
            [bounds._ne.lng, bounds._ne.lat],
          ],
        },
      },
    });
  if (price) {
    if (price[0]) filters.$and?.push({ price: { $gt: price[0] } });
    if (price[1]) filters.$and?.push({ price: { $lt: price[1] } });
  }
  if (sqft) {
    if (sqft[0]) filters.$and?.push({ sqft: { $gt: sqft[0] } });
    if (sqft[1]) filters.$and?.push({ sqft: { $lt: sqft[1] } });
  }
  if (bedrooms?.length) {
    const bedroomFilters = bedrooms.map((bedroom) =>
      bedroom === 4 ? { bedrooms: { $gte: 4 } } : { bedrooms: bedroom },
    );
    filters.$and?.push({ $or: bedroomFilters });
  }
  if (bathrooms?.length) {
    const bathroomFilters = bathrooms.map((bathroom) =>
      bathroom === 4 ? { bathrooms: { $gte: 4 } } : { bathrooms: bathroom },
    );
    filters.$and?.push({ $or: bathroomFilters });
  }
  if (misc?.length) {
    for (const miscFilter of misc) {
      filters.$and?.push({
        [`attributes.${miscFilter}`]: {
          $exists: true,
          $nin: [false, 0, ""],
        },
      });
    }
  }

  return filters;
};
