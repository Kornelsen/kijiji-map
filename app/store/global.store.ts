import { create } from "zustand";
import type { Nullable, TSelectedListings } from "../_types";

type State = {
  focusedListing: string;
  setFocusedListing: (listingId: string) => void;
  selectedListings: Nullable<TSelectedListings>;
  setSelectedListings: (points: Nullable<TSelectedListings>) => void;
};

export const useGlobalStore = create<State>((set) => ({
  focusedListing: "",
  setFocusedListing: (listingId: string) => set({ focusedListing: listingId }),
  selectedListings: null,
  setSelectedListings: (points: Nullable<TSelectedListings>) => {
    return set({ selectedListings: points });
  },
}));
