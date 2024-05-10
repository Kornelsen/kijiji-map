import { type Ad, ScraperType, search } from "kijiji-scraper";
import type { Db, Document, Filter } from "mongodb";
import { NextResponse } from "next/server";
import mongoClient from "../../_lib/mongodb";
import type { TListing } from "../../_types";

export async function POST(req: Request) {
	try {
		console.log("Starting scraping process.");
		const res = await req.json();
		const { locationId, categoryId } = res;
		const resp = await search(
			{
				locationId,
				categoryId,
				sortByName: "dateDesc",
				minResults: 60,
			},
			{ scraperType: ScraperType.HTML },
		);

		const listings = resp.map(mapToListing);

		await mongoClient.connect();
		const db = mongoClient.db("kijiji-map");

		const result = await db.collection("pending-listings").insertMany(listings);
		console.log(`${result.insertedCount} pending listings were found.`);
		console.log("Running agregation piepleine.");

		const beforeCount = await db.collection("listings").countDocuments();

		await db.collection("pending-listings").aggregate(mergePipeline).toArray();
		console.log("Aggregation pipeline finished.");
		const afterCount = await db.collection("listings").countDocuments();
		console.log(`${afterCount - beforeCount} new listings were inserted.`);

		console.log("Deleting pending listings.");
		deleteAll(db);
		console.log("Process finished successfully.");

		return NextResponse.json({ status: "success" });
	} catch (error) {
		return NextResponse.error();
	}
}

// TODO: do we need to connect and close the client everytime?
export async function GET(req: Request) {
	try {
		await mongoClient.connect();
		// TODO: use env var
		const db = mongoClient.db("kijiji-map");

		const url = new URL(req.url);
		const searchParams = new URLSearchParams(url.search);
		const bounds = searchParams.get("bounds");
		const location = bounds ? bounds.split(",") : null;

		const filters: Filter<Document> = {};
		if (location)
			filters.location = {
				$geoWithin: {
					$box: [
						[+location[0], +location[1]],
						[+location[2], +location[3]],
					],
				},
			};

		const data = await db
			.collection("listings")
			.find<TListing>(filters)
			.sort({ date: -1 })
			.toArray();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.error();
	} finally {
		mongoClient.close();
	}
}

// TODO: move function to another file
const mapToListing = (ad: Ad) => {
	return {
		listingId: ad.id,
		title: ad.title,
		image: ad.image,
		images: ad.images,
		address: ad.attributes.location.mapAddress,
		date: ad.date,
		location: {
			coordinates: [
				ad.attributes.location.longitude,
				ad.attributes.location.latitude,
			],
			type: "Point",
		},
		price: ad.attributes.price,
		bedrooms: ad.attributes.numberbedrooms,
		bathrooms: ad.attributes.numberbathrooms,
		url: ad.url,
		sqft: ad.attributes.areainfeet,
		attributes: ad.attributes,
	} as TListing;
};

const deleteAll = async (db: Db) => {
	db.collection("pending-listings").deleteMany({});
};

const mergePipeline: Document[] = [
	{
		$merge: {
			into: "listings",
			on: "listingId",
			whenMatched: "keepExisting",
			whenNotMatched: "insert",
		},
	},
];
