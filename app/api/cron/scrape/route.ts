import { NextResponse, type NextRequest } from "next/server";
import { ScraperType, categories, locations, search } from "kijiji-scraper";
import type { Db, Document } from "mongodb";

import mongoClient from "../../../_lib/mongodb";
import { mapToListing } from "../../listings/utils";

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get("authorization");
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return new Response("Unauthorized", {
				status: 401,
			});
		}

		console.log("Starting scraping process.");
		const resp = await search(
			{
				locationId: locations.ONTARIO.TORONTO_GTA.CITY_OF_TORONTO.id,
				categoryId: categories.REAL_ESTATE.FOR_RENT.LONG_TERM_RENTALS.id,
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

		return Response.json({ success: true });
	} catch (error) {
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
