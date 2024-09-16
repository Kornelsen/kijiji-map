import { useGlobalStore } from "@/app/store";
import type { GeoJSONPoint } from "@/app/_types";
import { formatAddress } from "@/app/_utils/string";
import { getRelativeTime } from "@/app/_utils/date";
import { ImagesDialog } from "./images-dialog";
import { Card } from "../shared";

type Props = {
  listing: GeoJSONPoint;
};

export const ListingCard = ({ listing }: Props) => {
  const { setHoveredCardCoordinates } = useGlobalStore((state) => state);

  const handleFocus = (coordinates: [number, number]) => () => {
    setHoveredCardCoordinates(coordinates);
  };

  const handleFocusEnd = () => {
    setHoveredCardCoordinates(null);
  };

  const {
    listingId,
    image,
    title,
    price,
    address,
    bedrooms,
    bathrooms,
    sqft,
    date,
  } = listing.properties;

  return (
    <Card
      key={listingId}
      className="w-full h-full flex flex-col"
      onFocus={handleFocus(listing.geometry.coordinates)}
      onMouseEnter={handleFocus(listing.geometry.coordinates)}
      onMouseLeave={handleFocusEnd}
    >
      <div className="relative overflow-hidden before:absolute before:top-0 before:cont" />
      <div className="flex flex-row w-full">
        <div className="flex-1">
          <ImagesDialog id={listingId} image={image} title={title} />
        </div>
        <div className="flex flex-col py-2 px-3 h-full w-full">
          <h2 className="text-lg font-bold">${price}</h2>
          <p className="text-xs">{formatAddress(address)}</p>
        </div>
      </div>
      <div className="flex flex-row px-2 py-1 bg-slate-100 items-center">
        <p className="text-xs">{getRelativeTime(new Date(date))}</p>
        <p className="text-xs ml-auto">
          {`${bedrooms ?? "?"} Beds • ${bathrooms ?? "?"} Baths${
            sqft ? ` • ${sqft} sqft` : ""
          }`}
        </p>
      </div>
    </Card>
  );
};
