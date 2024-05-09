import { TListing } from "@/app/_types";
import { ListingImage } from "../listing-image";
import { ListingDetails } from "../listing-details";

type Props = {
  listing: TListing;
  headingStyle?: string;
  bodyStyle?: string;
  captionStyle?: string;
  imageHeight?: number;
  imageWidth?: number;
};

export const Listing = ({
  listing,
  headingStyle = "text-xl font-bold pt-2",
  bodyStyle = "text-md",
  captionStyle = "text-sm",
  imageHeight = 288,
  imageWidth = 300,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <ListingImage
        height={imageHeight}
        width={imageWidth}
        images={listing.images}
      />
      <ListingDetails
        listing={listing}
        headingStyle={headingStyle}
        bodyStyle={bodyStyle}
        captionStyle={captionStyle}
      />
    </div>
  );
};
