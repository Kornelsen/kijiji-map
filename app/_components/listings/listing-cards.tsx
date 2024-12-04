"use client";

import { usePaginatedListings } from "@/app/hooks";
import { ListingCard } from "./listing-card";
import { Card, PaginationControl } from "../shared";
import { useFiltersStore } from "@/app/store";

const ITEMS_PER_PAGE = 10;

export const ListingCards = () => {
  const { data: listings } = usePaginatedListings();
  const { filters, updateFilters: updateFiltersStore } = useFiltersStore();
  if (!listings) return null;
  const { features, totalCount } = listings;

  // const [page, setPage] = useState(0);
  const handlePageChange = (newPage: number) => {
    updateFiltersStore({ skip: newPage * ITEMS_PER_PAGE });
  };

  // useEffect(() => {
  //   features && setPage(0);
  // }, [features]);

  const page = filters.skip !== undefined ? filters.skip / ITEMS_PER_PAGE : 0;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  // const listingsToDisplay = features?.slice(
  //   page * ITEMS_PER_PAGE,
  //   page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  // );

  return (
    <div className="grid grid-cols-1 gap-3">
      {features?.map((feature) => (
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
