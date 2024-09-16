import { create } from "zustand";
import type { Nullable, TSelectedListings } from "../_types";

type NullableListing = Nullable<TSelectedListings>;
type NullableCoordinates = Nullable<[number, number]>;

type State = {
  focusedListing: string;
  setFocusedListing: (listingId: string) => void;
  selectedListings: NullableListing;
  setSelectedListings: (points: NullableListing) => void;
  hoveredCardCoordinates: NullableCoordinates;
  setHoveredCardCoordinates: (coordinates: NullableCoordinates) => void;
};

export const useGlobalStore = create<State>((set) => ({
  focusedListing: "",
  setFocusedListing: (listingId: string) => set({ focusedListing: listingId }),
  selectedListings: null,
  setSelectedListings: (points: NullableListing) => {
    return set({ selectedListings: points });
  },
  hoveredCardCoordinates: null,
  setHoveredCardCoordinates: (coordinates: NullableCoordinates) => {
    return set({ hoveredCardCoordinates: coordinates });
  },
}));
