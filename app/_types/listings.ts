export type TListing = {
	title: string;
	image: string;
	images: string[];
	address: string;
	date: string;
	location: {
		coordinates: [number, number];
		type: "Point";
	};
	price: string;
	bedrooms: number;
	bathrooms: number;
	url: string;
	sqft?: number;
	attributes: Record<string, unknown>;
	listingId: string;
};
