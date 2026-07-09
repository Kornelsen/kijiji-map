"use client";

import dynamic from "next/dynamic";

// mapbox-gl dominates the first-load bundle; load the map after hydration so
// the listing cards (the LCP element) aren't blocked behind it
export const ListingsMapLazy = dynamic(
  () => import("./listings-map").then((m) => m.ListingsMap),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
  }
);
