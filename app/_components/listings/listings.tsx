"use client";

import { useEffect, useState } from "react";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ListingsMapLazy } from "../map/listings-map-lazy";
import { ListingCards } from "./listing-cards";
import { HeaderCard } from "./header-card";

export const Listings = () => {
  // mobile-only: which pane is visible below md; desktop always shows both
  const [showMap, setShowMap] = useState(false);

  // mount the map only once its pane is visible: mapbox-gl sizes itself at
  // init and skips the first ResizeObserver fire, so a map created inside
  // display:none stays stuck at its 400x300 fallback size
  const [mountMap, setMountMap] = useState(false);
  useEffect(() => {
    if (mountMap) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    if (showMap || desktop.matches) {
      setMountMap(true);
      return;
    }
    const onChange = (e: MediaQueryListEvent) => e.matches && setMountMap(true);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [showMap, mountMap]);

  return (
    <div className="flex flex-row h-dvh w-full overflow-hidden">
      <div
        className={cn(
          "flex-col gap-3 py-3 px-3 overflow-y-auto w-full md:w-[450px]",
          showMap ? "hidden md:flex" : "flex"
        )}
      >
        <HeaderCard />
        <ListingCards />
      </div>
      <div className={cn("grow", showMap ? "flex" : "hidden md:flex")}>
        {mountMap && <ListingsMapLazy />}
      </div>
      <Button
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-10 gap-2 rounded-full px-5 shadow-lg"
        onClick={() => setShowMap((prev) => !prev)}
      >
        {showMap ? (
          <>
            <List className="h-4 w-4" />
            List
          </>
        ) : (
          <>
            <MapIcon className="h-4 w-4" />
            Map
          </>
        )}
      </Button>
    </div>
  );
};
