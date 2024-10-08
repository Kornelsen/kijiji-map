"use client";

import { useListings } from "@/app/hooks";
import { Card } from "../shared";
import { Filters } from "./filters";

export const HeaderCard = () => {
  const { data: listings } = useListings();

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex flex-row items-end justify-between">
        <h1 className="text-2xl font-bold">Toronto Rentals</h1>
        <p className="font-semibold">
          {listings?.features?.length ?? 0} Listings
        </p>
      </div>
      <Filters />
    </Card>
  );
};
