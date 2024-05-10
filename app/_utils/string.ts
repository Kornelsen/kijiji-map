export const toTitleCase = (value: string): string => {
	const words = value.toLowerCase().split("_");

	for (let i = 0; i < words.length; i++) {
		words[i] = words[i][0].toUpperCase() + words[i].substring(1);
	}

	return words.join(" ");
};

export const formatAddress = (value: string) => {
	const words = value.split(",");
	return `${words[0]}${words[1] ? `, ${words[1]}` : ""}`;
};
