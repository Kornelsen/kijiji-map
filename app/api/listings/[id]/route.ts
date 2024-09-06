import { NextResponse } from "next/server";
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

    const data = await db
      .collection("listings")
      .findOne<TListing>({ listingId: params.id });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
