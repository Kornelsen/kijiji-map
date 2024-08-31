import { NextResponse } from "next/server";
import { ScraperType, categories, locations, search } from "kijiji-scraper";
import type { Db, Document } from "mongodb";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

import mongoClient from "../../../_lib/mongodb";
import { mapToListing } from "../../listings/utils";

export const POST = verifySignatureAppRouter(async () => {
	try {
		console.info("Starting scraping process.");
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
		console.info(`${result.insertedCount} pending listings were found.`);
		console.info("Running agregation piepleine.");

		const beforeCount = await db.collection("listings").countDocuments();

		await db.collection("pending-listings").aggregate(mergePipeline).toArray();
		console.info("Aggregation pipeline finished.");
		const afterCount = await db.collection("listings").countDocuments();
		console.info(`${afterCount - beforeCount} new listings were inserted.`);

		console.info("Deleting pending listings.");
		deleteAll(db);
		console.info("Process finished successfully.");

		return Response.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.error();
	}
});

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
