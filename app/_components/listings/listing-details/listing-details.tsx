import { formatAddress } from "@/app/_utils/string";
import { TListing } from "@/app/_types";
import { Button } from "../../shared";

type Props = {
  listing: TListing;
  headingStyle: string;
  bodyStyle: string;
  captionStyle: string;
};

export const ListingDetails = ({
  listing,
  headingStyle,
  bodyStyle,
  captionStyle,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 px-5 pb-5 h-full">
      <h2 className={headingStyle}>${listing.price}</h2>
      <p className={bodyStyle}>{formatAddress(listing.address)}</p>
      <p className={captionStyle}>{`${listing.bedrooms ?? "?"} Beds • ${
        listing.bathrooms ?? "?"
      } Baths${listing.sqft ? ` • ${listing.sqft} sqft` : ""}`}</p>
      <form action={listing.url} target="_blank" className="mt-auto">
        <Button>View Listing</Button>
      </form>
    </div>
  );
};
