import { NextResponse } from "next/server";
import mongoClient from "@/lib/mongodb";
import type { TFilters, TListing } from "../../_types";
import { getFilters } from "./utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  try {
    // TODO: use env var
    const db = mongoClient.db("kijiji-map");

    const filtersParam = searchParams.get("filters");

    if (!filtersParam)
      return new Response("Bad Request", {
        status: 400,
      });

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
