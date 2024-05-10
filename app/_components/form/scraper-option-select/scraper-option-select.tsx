"use client";
import type { TScraperOptions } from "@/app/_types";
import { toTitleCase } from "@/app/_utils/string";
import type { ChangeEvent } from "react";

type Props = {
	label: string;
	name: string;
	value?: string;
	options: TScraperOptions;
	onChange: ({ name, value }: { name: string; value: string | number }) => void;
};

export const ScraperOptionSelect = ({
	label,
	name,
	value,
	options,
	onChange,
}: Props) => {
	const groups = Object.keys(options);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange({ name: e.target.name, value: +e.target.value });
	};

	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={name}>{label}</label>
			<select
				name={name}
				id={name}
				value={value}
				onChange={handleChange}
				className="text-black p-2 rounded"
				defaultValue="default"
			>
				{groups
					.filter((group) => group.toLowerCase() !== "id")
					.map((group) => (
						<optgroup key={group} label={toTitleCase(group)}>
							<option value="default" disabled hidden>
								{label}
							</option>
							{Object.keys(options[group])
								.filter((option) => option.toLowerCase() !== "id")
								.map((option) => (
									<option
										// @ts-ignore
										key={options[group][option].id}
										// @ts-ignore
										value={options[group][option].id}
									>
										{toTitleCase(option)}
									</option>
								))}
						</optgroup>
					))}
			</select>
		</div>
	);
};
