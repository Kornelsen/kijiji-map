import { NextResponse } from "next/server";
import mongoClient from "@/lib/mongodb";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export const POST = verifySignatureAppRouter(async () => {
  try {
    console.info("Starting deletion process");
    await mongoClient.connect();
    const db = mongoClient.db(process.env.DB_NAME);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const items = await db
      .collection("listing-features")
      .deleteMany({ "properties.date": { $lt: threeMonthsAgo } });

    console.info("Deletion process finished successfully");
    console.info(`${items.deletedCount} listings were deleted`);

    return Response.json({ deletedCount: items.deletedCount });
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
});
