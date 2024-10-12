import { NextResponse } from "next/server";
import mongoClient from "@/lib/mongodb";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import type { Collection, Document, WithId } from "mongodb";

export const POST = verifySignatureAppRouter(async () => {
  try {
    console.info("Starting archival process");

    await mongoClient.connect();
    const db = mongoClient.db(process.env.DB_NAME);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const filter = {
      $or: [
        { "properties.date": { $lt: twoMonthsAgo } },
        { "properties.attribute.dateavailable": { $lte: new Date() } },
      ],
    };

    const projection = {
      _id: 1,
      geometry: 1,
      "properties.price": 1,
      "properties.bedrooms": 1,
      "properties.bathrooms": 1,
      "properties.sqft": 1,
      "properties.attributes.unittype": 1,
      "properties.attributes.visits": 1,
      "properties.attributes.type": 1,
      "properties.attributes.forrentbyhousing": 1,
      "properties.attributes.numberparkingspots": 1,
    };

    const sourceCollection = db.collection("listing-features");
    const destinationCollection = db.collection("listings-archive");

    const itemsToArchive = await sourceCollection
      .find(filter, { projection })
      .toArray();

    if (!itemsToArchive.length) {
      console.info("No listings to archive");
      return Response.json({ archivedCount: 0 });
    }

    console.info(`Found ${itemsToArchive.length} listings to archive`);

    const idsToDelete = await bulkInsert(destinationCollection, itemsToArchive);

    console.info(`Archived ${idsToDelete.length} listings`);

    if (!idsToDelete.length) return Response.json({ archivedCount: 0 });

    console.info("Deleting archived listings from source collection");

    await sourceCollection.deleteMany({ _id: { $in: idsToDelete } });

    console.info("Archival process finished successfully");

    return Response.json({ archivedCount: itemsToArchive.length });
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
});

const bulkInsert = async (
  collection: Collection<Document>,
  documents: WithId<Document>[]
) => {
  const bulkInsert = collection.initializeUnorderedBulkOp();
  const insertIds = [];

  for (const doc of documents) {
    const id = doc._id;
    bulkInsert.find({ _id: id }).upsert().replaceOne(doc);
    insertIds.push(id);
  }
  if (insertIds.length) await bulkInsert.execute();
  return insertIds;
};
