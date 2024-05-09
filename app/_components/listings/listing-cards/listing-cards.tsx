import { TListing } from "@/app/_types";
import { Card } from "../../shared/card";
import { Listing } from "../listing";

type Props = {
  listings?: TListing[];
};

export const ListingCards = ({ listings }: Props) => {
  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 items-stretch">
      {listings?.map((listing) => (
        <Card key={listing.listingId} className="p-0 w-[300px] h-full">
          <Listing listing={listing} />
        </Card>
      ))}
    </div>
  );
};
