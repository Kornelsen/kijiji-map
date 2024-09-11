import { ListingCards } from "./listing-cards";
import { ListingsMap } from "../map";
import { HeaderCard } from "./header-card";

export const Listings = () => {
  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <div className="flex flex-col gap-3 py-3 px-3 overflow-y-auto w-[450px]">
        <HeaderCard />
        <ListingCards />
      </div>
      <div className="flex grow">
        <ListingsMap />
      </div>
    </div>
  );
};
