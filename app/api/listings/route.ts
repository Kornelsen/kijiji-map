import { ScraperType, search } from "kijiji-scraper";
import type { Db, Document } from "mongodb";
import { NextResponse } from "next/server";
import mongoClient from "../../_lib/mongodb";
import type { TFilters, TListing } from "../../_types";
import { getFilters, mapToListing } from "./utils";

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

export async function GET(req: Request) {
	try {
		// TODO: use env var
		const db = mongoClient.db("kijiji-map");

		const url = new URL(req.url);
		const searchParams = new URLSearchParams(url.search);
		const filtersParam = searchParams.get("filters");

		if (!filtersParam) return NextResponse.error();

		const decodedParams = decodeURIComponent(filtersParam);
		const parsedParams: TFilters = JSON.parse(decodedParams);
		const filters = getFilters(parsedParams);

		const data = await db
			.collection("listings")
			.find<TListing>(filters)
			.sort({ date: -1 })
			.toArray();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.error();
	}
}

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
