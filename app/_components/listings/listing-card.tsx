import { useGlobalStore } from "@/app/store";
import type { ListingFeature } from "@/app/_types";
import { formatAddress } from "@/app/_utils/string";
import { getRelativeTime } from "@/app/_utils/date";
import { ImagesDialog } from "./images-dialog";
import { Card } from "../shared";

type Props = {
  listing: ListingFeature;
  priority?: boolean;
  compact?: boolean;
};

// price arrives from the scraper as a numeric string, e.g. "1950"
const formatPrice = (price: string) => {
  const numeric = Number(price);
  return Number.isFinite(numeric)
    ? `$${numeric.toLocaleString("en-CA")}/mo`
    : `$${price}/mo`;
};

const getStats = ({
  bedrooms,
  bathrooms,
  sqft,
}: ListingFeature["properties"]) => {
  const stats = [];
  if (bedrooms === 0) stats.push("Studio");
  else if (bedrooms != null)
    stats.push(`${bedrooms} ${bedrooms === 1 ? "bd" : "bds"}`);
  if (bathrooms != null) stats.push(`${bathrooms} ba`);
  if (sqft) stats.push(`${sqft} sqft`);
  return stats;
};

export const ListingCard = ({ listing, priority, compact }: Props) => {
  const { setHoveredCardCoordinates } = useGlobalStore((state) => state);

  const handleFocus = (coordinates: [number, number]) => () => {
    setHoveredCardCoordinates(coordinates);
  };

  const handleFocusEnd = () => {
    setHoveredCardCoordinates(null);
  };

  const { listingId, image, title, price, address, date } = listing.properties;

  const stats = getStats(listing.properties);

  return (
    <Card
      key={listingId}
      className="w-full h-full flex flex-col"
      onFocus={handleFocus(listing.geometry.coordinates)}
      onMouseEnter={handleFocus(listing.geometry.coordinates)}
      onMouseLeave={handleFocusEnd}
    >
      <div className="relative">
        <ImagesDialog
          id={listingId}
          image={image}
          title={title}
          priority={priority}
        />
        {/* computed from now(), so the SSR'd text can lag the client's */}
        <span
          className="absolute top-2 left-2 rounded bg-white/95 px-2 py-0.5 text-xs font-medium shadow pointer-events-none"
          suppressHydrationWarning
        >
          {getRelativeTime(new Date(date))}
        </span>
      </div>
      <div
        className={
          compact
            ? "flex flex-col px-2.5 py-1.5"
            : "flex flex-col gap-0.5 px-3 py-2"
        }
      >
        <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
          {formatPrice(price)}
        </h2>
        {!!stats.length && (
          <p className={compact ? "text-xs font-medium" : "text-sm font-medium"}>
            {stats.map((stat, index) => (
              <span key={stat}>
                {index > 0 && <span className="mx-1.5 text-neutral-300">|</span>}
                {stat}
              </span>
            ))}
          </p>
        )}
        <p
          className={
            compact
              ? "text-xs text-neutral-500 truncate"
              : "text-sm text-neutral-500 truncate"
          }
        >
          {formatAddress(address)}
        </p>
      </div>
    </Card>
  );
};
