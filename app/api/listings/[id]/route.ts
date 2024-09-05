import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import mongoClient from "@/lib/mongodb";
import type { TListing } from "@/app/_types";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  try {
    // TODO: use env var
    const db = mongoClient.db("kijiji-map");

    const objectId = ObjectId.createFromHexString(params.id);

    const data = await db
      .collection("listings")
      .findOne<TListing>({ _id: objectId });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
