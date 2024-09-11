import { useGlobalStore } from "@/app/store";
import type { TListing } from "@/app/_types";
import { formatAddress } from "@/app/_utils/string";
import { getRelativeTime } from "@/app/_utils/date";
import { ImagesDialog } from "./images-dialog";
import { Card } from "../shared";

type Props = {
  listing: TListing;
};

export const ListingCard = ({ listing }: Props) => {
  const setFocusedListing = useGlobalStore((state) => state.setFocusedListing);

  const handleFocus = (listingId: string) => () => {
    setFocusedListing(listingId);
  };

  const handleFocusEnd = () => {
    setFocusedListing(null);
  };

  return (
    <Card
      key={listing.listingId}
      className="w-full h-full flex flex-col"
      onFocus={handleFocus(listing.listingId)}
      onMouseEnter={handleFocus(listing.listingId)}
      onMouseLeave={handleFocusEnd}
    >
      <div className="relative overflow-hidden before:absolute before:top-0 before:cont" />
      <div className="flex flex-row w-full">
        <div className="flex-1">
          <ImagesDialog
            id={listing.listingId}
            image={listing.image}
            title={listing.title}
          />
        </div>
        <div className="flex flex-col py-2 px-3 h-full w-full">
          <h2 className="text-lg font-bold">${listing.price}</h2>
          <p className="text-xs">{formatAddress(listing.address)}</p>
        </div>
      </div>
      <div className="flex flex-row px-2 py-1 bg-slate-100 items-center">
        <p className="text-xs">{getRelativeTime(new Date(listing.date))}</p>
        <p className="text-xs ml-auto">
          {`${listing.bedrooms ?? "?"} Beds • ${
            listing.bathrooms ?? "?"
          } Baths${listing.sqft ? ` • ${listing.sqft} sqft` : ""}`}
        </p>
      </div>
    </Card>
  );
};
