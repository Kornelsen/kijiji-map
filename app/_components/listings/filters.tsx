import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FaTimes } from "react-icons/fa";
import { useFiltersStore } from "@/app/store";
import type { TFilters, TInput } from "@/app/_types";
import { MultipleSelect, SliderInput } from "../form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import {
  initialFilters,
  bathOptions,
  bedOptions,
  miscOptions,
} from "@/app/constants";

export const Filters = () => {
  const {
    filters: filtersStoreState,
    updateFilters: updateFiltersStore,
    clearFilters,
  } = useFiltersStore();
  const [filters, setFilters] = useState<TFilters>(filtersStoreState);

  const handleChange = ({ name, value }: TInput<unknown>) => {
    setFilters({ ...filters, [name]: value });
    debouncedFiltersUpdate({ name, value });
  };

  const handleClearFilters = () => {
    clearFilters();
    setFilters({ ...initialFilters, bounds: filters.bounds });
  };

  const debouncedFiltersUpdate = useDebouncedCallback(
    ({ name, value }: TInput<unknown>) => updateFiltersStore({ [name]: value }),
    500
  );

  const activeFiltersCount = getActiveFiltersCount(filters);

  return (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem value="filters">
        <AccordionTrigger className="flex gap-1 text-white text-md p-0 hover:no-underline rounded bg-[#373373] px-4 py-2 w-full">
          Filters
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 pt-4 px-1">
          <MultipleSelect<number>
            name="bedrooms"
            options={bedOptions}
            label="Number of bedrooms"
            selected={filters.bedrooms}
            onChange={handleChange}
          />
          <MultipleSelect<number>
            name="bathrooms"
            options={bathOptions}
            label="Number of bathrooms"
            selected={filters.bathrooms}
            onChange={handleChange}
          />
          <SliderInput
            name="price"
            label="Price"
            min={0}
            max={5000}
            value={filters.price}
            type="currency"
            onChange={handleChange}
          />
          <SliderInput
            name="sqft"
            label="Sqft"
            min={0}
            max={3000}
            value={filters.sqft}
            onChange={handleChange}
          />
          <MultipleSelect<string>
            name="misc"
            options={miscOptions}
            label="Miscellaneous"
            selected={filters.misc}
            onChange={handleChange}
          />
        </AccordionContent>
      </AccordionItem>
      {!!activeFiltersCount && (
        <div className="flex items-center">
          <span>
            {activeFiltersCount} Filter{activeFiltersCount > 1 ? "s" : ""}{" "}
            Active
          </span>
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex gap-1 items-center w-fit hover:underline ml-auto"
          >
            <FaTimes />
            Clear Filters
          </button>
        </div>
      )}
    </Accordion>
  );
};

const getActiveFiltersCount = (filters: TFilters) => {
  const excludedFilters = ["bounds", "misc", "price", "sqft"];
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) =>
      !excludedFilters.includes(key) &&
      (Array.isArray(value) ? value.length : value)
  );

  let additional = 0;

  if (filters.price && (filters.price[0] || filters.price[1])) additional++;
  if (filters.sqft && (filters.sqft[0] || filters.sqft[1])) additional++;

  return activeFilters.length + filters.misc.length + additional;
};
