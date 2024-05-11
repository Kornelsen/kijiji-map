import type { TFilters, TInput } from "@/app/_types";
import { useState } from "react";
import { CurrencyInput } from "../../form/currency-input";
import { Input } from "../../form/input";
import { MultipleSelect } from "../../form/multiple-select";
import { Accordion } from "../../shared/accordion";

type Props = {
	onChange: (input: TInput<unknown>) => void;
	initialFilters: TFilters;
};

export const Filters = ({ onChange, initialFilters }: Props) => {
	const [filters, setFilters] = useState(initialFilters);
	const [expanded, setExpanded] = useState(false);
	const handleClick = () => {
		setExpanded(!expanded);
	};

	const handleChange = ({ name, value }: TInput<unknown>) => {
		setFilters({ ...filters, [name]: value });
		onChange({ name, value });
	};

	return (
		<Accordion label="Filters" expanded={expanded} onClick={handleClick}>
			<div className="flex flex-col gap-2">
				<hr className="my-2" />
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
				<div className="flex flex-col 2xl:flex-row gap-2">
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
				<div className="flex flex-col 2xl:flex-row gap-2">
					<Input
						name="minSqft"
						label="Min Sqft"
						placeholder="0"
						type="number"
						value={null}
						onChange={handleChange}
					/>
					<Input
						name="maxSqft"
						label="Max Sqft"
						placeholder="Unlimited"
						type="number"
						value={null}
						onChange={handleChange}
					/>
				</div>
				<MultipleSelect<string>
					name="misc"
					options={miscOptions}
					label="Miscellaneous"
					selected={filters.misc}
					onChange={handleChange}
				/>
				<hr className="my-2" />
			</div>
		</Accordion>
	);
};

// TODO: move these to another file

const bedOptions = [
	{ label: "0", value: 0 },
	{ label: "1", value: 1 },
	{ label: "1.5", value: 1.5 },
	{ label: "2", value: 2 },
	{ label: "2.5", value: 2.5 },
	{ label: "3", value: 3 },
];

const bathOptions = [
	{ label: "1", value: 1 },
	{ label: "2", value: 2 },
	{ label: "3", value: 3 },
];

const miscOptions = [
	{ label: "A/C", value: "airconditioning" },
	{ label: "Parking", value: "numberparkingspots" },
	{ label: "Dishwasher", value: "dishwasher" },
	{ label: "Laundry", value: "laundryinunit" },
	{ label: "Furnished", value: "furnished" },
	{ label: "Balcony", value: "balcony" },
	{ label: "Locker", value: "storagelocker" },
	{ label: "Gym", value: "gym" },
	{ label: "Pool", value: "pool" },
	{ label: "Elevator", value: "elevator" },
	{ label: "Concierge", value: "concierge" },
];
