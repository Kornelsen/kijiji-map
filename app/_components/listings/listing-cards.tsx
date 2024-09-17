"use client";

import { useEffect, useState } from "react";
import { useListings } from "@/app/hooks";
import { ListingCard } from "./listing-card";
import { Card, PaginationControl } from "../shared";

const ITEMS_PER_PAGE = 10;

export const ListingCards = () => {
  const { data: listingsTest } = useListings();
  const features = listingsTest?.features;

  const [page, setPage] = useState(0);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    features && setPage(0);
  }, [features]);

  const totalPages = Math.ceil((features?.length || 0) / ITEMS_PER_PAGE);
  const listingsToDisplay = features?.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 gap-3">
      {listingsToDisplay?.map((feature) => (
        <ListingCard key={feature.properties.listingId} listing={feature} />
      ))}
      <Card className="p-3 sticky">
        <PaginationControl
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Card>
    </div>
  );
};
