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
  maxPrice,
  minPrice,
  maxSqft,
  minSqft,
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
  if (maxPrice) filters.$and?.push({ price: { $lt: maxPrice } });
  if (minPrice) filters.$and?.push({ price: { $gt: minPrice } });
  if (maxSqft) filters.$and?.push({ sqft: { $lt: maxSqft } });
  if (minSqft) filters.$and?.push({ sqft: { $gt: minSqft } });
  if (bedrooms?.length) filters.$and?.push({ bedrooms: { $in: bedrooms } });
  if (bathrooms?.length) filters.$and?.push({ bathrooms: { $in: bathrooms } });
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
