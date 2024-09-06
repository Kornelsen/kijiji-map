"use client";

import { useListings } from "@/app/api/listings";

import { Card } from "../shared/card";
import { Filters } from "./filters";
import { ListingCards } from "./listing-cards";
import { ListingsMap } from "./listings-map";
import { ScrapeButton } from "./scrape-button";
import { useFiltersStore } from "@/app/store";

export const Listings = () => {
  const filters = useFiltersStore((state) => state.filters);
  const { data: listings = [], isFetching } = useListings(filters);

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <div className="flex flex-col gap-3 py-3 px-3 overflow-y-auto w-[450px]">
        <Card className="p-4 flex flex-col gap-2">
          <div className="flex flex-col justify-between">
            <h1 className="text-2xl font-bold">Toronto Rentals</h1>
            <p className="font-semibold">{listings.length} Listings</p>
          </div>
          <Filters />
        </Card>
        <ListingCards listings={listings} />
      </div>
      <div className="flex grow">
        <ListingsMap listings={listings} loading={isFetching} />
      </div>
    </div>
  );
};
