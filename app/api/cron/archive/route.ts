import { NextResponse } from "next/server";
import mongoClient from "../../../_lib/mongodb";

export async function POST() {
	try {
		console.info("Starting deletion process");
		await mongoClient.connect();
		const db = mongoClient.db("kijiji-map");

		const threeMonthsAgo = new Date();
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

		const items = await db
			.collection("listings")
			.deleteMany({ date: { $lt: threeMonthsAgo } });

		console.info("Deletion process finished successfully");
		console.info(`${items.deletedCount} listings were deleted`);

		return Response.json({ deletedCount: items.deletedCount });
	} catch (e) {
		console.error(e);
		return NextResponse.error();
	}
}
