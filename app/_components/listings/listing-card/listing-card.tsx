import type { TListing } from "@/app/_types";
import { formatAddress } from "@/app/_utils/string";
import { getRelativeTime } from "@/app/_utils/date";
import { ImagesDialog } from "../images-dialog";
import { Card } from "../../shared";

type Props = {
  listing: TListing;
  onFocus: (listingId: string) => void;
  onFocusEnd: () => void;
};

export const ListingCard = ({ listing, onFocus, onFocusEnd }: Props) => (
  <Card
    key={listing.listingId}
    className="w-full h-full flex flex-col"
    onFocus={() => onFocus(listing.listingId)}
    onMouseEnter={() => onFocus(listing.listingId)}
    onMouseLeave={onFocusEnd}
  >
    <div className="relative overflow-hidden before:absolute before:top-0 before:cont" />
    <div className="flex flex-row w-full">
      <div className="flex-1">
        <ImagesDialog
          id={listing._id}
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
        {`${listing.bedrooms ?? "?"} Beds • ${listing.bathrooms ?? "?"} Baths${
          listing.sqft ? ` • ${listing.sqft} sqft` : ""
        }`}
      </p>
    </div>
  </Card>
);
