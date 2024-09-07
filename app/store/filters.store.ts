import { create } from "zustand";
import type { TFilters } from "../_types";
import { initialFilters } from "@/app/constants";

type State = {
  filters: TFilters;
  setFilters: (filters: TFilters) => void;
  updateFilters: (filters: Partial<TFilters>) => void;
};

export const useFiltersStore = create<State>((set) => ({
  filters: initialFilters,
  setFilters: (filters) => set({ filters }),
  updateFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
