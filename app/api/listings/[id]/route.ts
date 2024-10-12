import { NextResponse } from "next/server";
import mongoClient from "@/lib/mongodb";
import type { ListingFeature } from "@/app/_types";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  try {
    const db = mongoClient.db(process.env.DB_NAME);

    const data = await db
      .collection("listing-features")
      .findOne<ListingFeature>({ "properties.listingId": params.id });

    if (!data) {
      return new Response("Listing Not Found", {
        status: 404,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
