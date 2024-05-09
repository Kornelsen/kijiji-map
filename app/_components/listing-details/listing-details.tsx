import Image from "next/image";
import { formatAddress } from "@/app/_utils/string";
import { TListing } from "@/app/_types";
import { Button } from "../button";

type Props = {
  listing: TListing;
  size?: "large" | "small";
};

export const ListingDetails = ({ size = "large", listing }: Props) => {
  const isSmall = size === "small";
  const imgHeight = isSmall ? 216 : 288;
  const imgWidth = isSmall ? 225 : 300;
  const headingStyle = isSmall ? "text-lg" : "text-xl font-bold pt-2";
  const bodyStyle = isSmall ? "text-sm" : "text-md";
  const captionStyle = isSmall ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* TODO: Add image carousel */}
      <div className={`h-${imgHeight}`}>
        <Image
          src={
            listing.images[0] ||
            // TODO: add to assets folder
            "https://www.kijiji.ca/next-assets/images/not-found.jpg"
          }
          alt={`${listing.address} Image`}
          className="object-cover object-center rounded-t"
          width={imgWidth}
          height={imgHeight}
        />
      </div>
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
    </div>
  );
};
