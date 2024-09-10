import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FaTimes } from "react-icons/fa";
import { useFiltersStore } from "@/app/store";
import type { TFilters, TInput } from "@/app/_types";
import { CurrencyInput } from "../../form/currency-input";
import { Input } from "../../form/input";
import { MultipleSelect } from "../../form/multiple-select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { Slider } from "../../ui/slider";
import { bathOptions, bedOptions, miscOptions } from "./filters.constants";
import { initialFilters } from "@/app/constants";

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
    500,
  );

  const activeFiltersCount = getActiveFiltersCount(filters);

  return (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem value="filters">
        <AccordionTrigger className="flex gap-1 text-white text-md p-0 hover:no-underline rounded bg-[#373373] px-4 py-2 w-full">
          Filters
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 pt-4 px-1">
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
          <div className="flex gap-2">
            <CurrencyInput
              name="minPrice"
              label="Min Price"
              placeholder="$0"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <CurrencyInput
              name="maxPrice"
              label="Max Price"
              placeholder="Unlimited"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
          <Slider
            min={0}
            max={10000}
            value={[filters.minPrice || 0, filters.maxPrice || 10000]}
            step={50}
            onValueChange={([min, max]) => {
              max === filters.maxPrice
                ? handleChange({ name: "minPrice", value: min })
                : handleChange({ name: "maxPrice", value: max });
            }}
            className="py-2"
            double
          />
          <div className="flex gap-2">
            <Input
              name="minSqft"
              label="Min Sqft"
              placeholder="0"
              type="number"
              value={filters.minSqft}
              onChange={handleChange}
            />
            <Input
              name="maxSqft"
              label="Max Sqft"
              placeholder="Unlimited"
              type="number"
              value={filters.maxSqft}
              onChange={handleChange}
            />
          </div>
          <Slider
            min={0}
            max={2000}
            value={[filters.minSqft || 0, filters.maxSqft || 2000]}
            step={50}
            onValueChange={([min, max]) => {
              max === filters.maxSqft
                ? handleChange({ name: "minSqft", value: min })
                : handleChange({ name: "maxSqft", value: max });
            }}
            className="py-2"
            double
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
      <div className="flex items-center">
        {!!activeFiltersCount && (
          <span>
            {activeFiltersCount} Filter{activeFiltersCount > 1 ? "s" : ""}{" "}
            Active
          </span>
        )}
        <button
          type="button"
          onClick={handleClearFilters}
          className="flex gap-1 items-center w-fit hover:underline ml-auto"
        >
          <FaTimes />
          Clear Filters
        </button>
      </div>
    </Accordion>
  );
};

const getActiveFiltersCount = (filters: TFilters) => {
  const excludedFilters = ["bounds", "misc"];
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) =>
      !excludedFilters.includes(key) &&
      (Array.isArray(value) ? value.length : value),
  );

  return activeFilters.length + filters.misc.length;
};
