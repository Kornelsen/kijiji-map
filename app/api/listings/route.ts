import { NextResponse } from "next/server";
import type { TFilters } from "../../_types";
import { getListingsData } from "./listings.utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  try {
    const filtersParam = searchParams.get("filters");

    if (!filtersParam)
      return new Response("Bad Request", {
        status: 400,
      });

    const decodedParams = decodeURIComponent(filtersParam);
    const parsedParams: TFilters = JSON.parse(decodedParams);

    const data = await getListingsData(parsedParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
