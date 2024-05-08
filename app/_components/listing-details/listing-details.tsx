import { formatAddress } from "@/app/_utils/string";
import { Button } from "../button";
import { TListing } from "@/app/_types";

type Props = {
  listing: TListing;
  size?: "large" | "small";
};

export const ListingDetails = ({ size = "large", listing }: Props) => {
  const isSmall = size === "small";
  const imgHeight = isSmall ? "[216px]" : "[288px]";
  const imgWidth = isSmall ? "[225px]" : "[300px]";
  const imageStyle = `w-${imgWidth} h-${imgHeight} object-cover object-center rounded-t`;
  // const imageStyle = `w-[300px] h-[288px] object-cover object-center rounded-t`;
  const headingStyle = isSmall ? "text-lg" : "text-xl font-bold pt-2";
  const bodyStyle = isSmall ? "text-sm" : "text-md";
  const captionStyle = isSmall ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* TODO: Add image carousel */}
      <div className={`h-${imgHeight}`}>
        <img
          src={
            listing.images[0] ||
            // TODO: add to assets folder
            "https://www.kijiji.ca/next-assets/images/not-found.jpg"
          }
          alt={`${listing.address} Image`}
          className={imageStyle}
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
