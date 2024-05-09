"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LngLatBounds } from "react-map-gl";

import { getListings, initalBounds } from "@/app/api/listings";
import { TFilters, TInput, TListing } from "@/app/_types";

import { ListingCards } from "./listing-cards";
import { ListingsMap } from "./listings-map";
import { Card } from "../shared/card";
import { ScrapeButton } from "../listings/scrape-button";
import { Filters } from "./filters";

export const Listings = () => {
  const [filters, setFilters] = useState<TFilters>({
    bounds: initalBounds,
    minPrice: null,
    maxPrice: null,
    bedrooms: [],
    bathrooms: [],
    misc: [],
  });

  const { data: listings, isFetching } = useQuery<TListing[]>({
    queryKey: [
      "listings",
      filters.bounds._sw.lng,
      filters.bounds._sw.lat,
      filters.bounds._ne.lng,
      filters.bounds._ne.lat,
    ],
    queryFn: () => getListings(filters.bounds),
    placeholderData: keepPreviousData,
  });

  const handleFilterChange = ({ name, value }: TInput<unknown>) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleMoveEnd = async (bounds: LngLatBounds) => {
    setFilters({ ...filters, bounds });
  };

  const filteredListings = listings ? applyFilters(listings, filters) : [];

  return (
    <div className="flex flex-row h-screen w-full">
      <div className="flex flex-col gap-4 p-5 overflow-y-auto w-[340px] 2xl:w-[650px]">
        {/* <ScrapeButton /> */}
        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-bold">Toronto Rentals</h1>
            <p className="font-semibold">{filteredListings.length} Listings</p>
          </div>
          <Filters filters={filters} handleChange={handleFilterChange} />
        </Card>
        <ListingCards listings={filteredListings} />
      </div>
      <div className="flex grow">
        <ListingsMap
          listings={filteredListings}
          loading={isFetching}
          onMoveEnd={handleMoveEnd}
        />
      </div>
    </div>
  );
};

const applyFilters = (
  listings: TListing[],
  { bedrooms, bathrooms, maxPrice, minPrice, maxSqft, minSqft, misc }: TFilters
) => {
  return listings.filter((listing) => {
    if (maxPrice && +listing.price > maxPrice) return false;
    if (minPrice && +listing.price < minPrice) return false;
    if (maxSqft && +(listing.sqft || 0) > maxSqft) return false;
    if (minSqft && +(listing.sqft || 0) < minSqft) return false;
    if (bedrooms.length && !bedrooms.includes(listing.bedrooms)) return false;
    if (bathrooms.length && !bathrooms.includes(listing.bathrooms))
      return false;
    if (misc.length) {
      for (let item of misc) {
        if (!listing.attributes[item]) return false;
      }
    }
    return true;
  });
};
