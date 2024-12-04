import { NextResponse } from "next/server";
import type { TFilters } from "../../_types";
import { getFilters, getListingsData } from "./listings.utils";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const filtersParam = searchParams.get("filters");

    if (!filtersParam)
      return new Response("Bad Request", {
        status: 400,
      });

    try {
      const decodedParams = decodeURIComponent(filtersParam);
      const parsedParams: TFilters = JSON.parse(decodedParams);
      const filters = getFilters(parsedParams);

      const data = await getListingsData(
        filters,
        parsedParams.limit,
        parsedParams.skip
      );

      return NextResponse.json(data);
    } catch (err) {
      console.error(err);
      return new Response("Something went wrong", {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
