import { create } from "zustand";
import type { Nullable } from "../_types";

type State = {
  focusedListing: Nullable<string>;
  setFocusedListing: (listingId: Nullable<string>) => void;
};

export const useGlobalStore = create<State>((set) => ({
  focusedListing: null,
  setFocusedListing: (listingId: Nullable<string>) =>
    set({ focusedListing: listingId }),
}));
