import { useState } from "react";
import { Button } from "../button";
import { categories, locations } from "kijiji-scraper";

export const ScrapeButton = () => {
  const [scraping, setScraping] = useState(false);

  const scrapeListings = async () => {
    setScraping(true);
    // TODO: use env var for api url
    await fetch("http://localhost:3000/api", {
      method: "POST",
      body: JSON.stringify({
        categoryId: categories.REAL_ESTATE.FOR_RENT.LONG_TERM_RENTALS.id,
        locationId: locations.ONTARIO.TORONTO_GTA.CITY_OF_TORONTO.id,
      }),
    });
    setScraping(false);
  };
  return (
    <Button onClick={scrapeListings} disabled={scraping}>
      Scrape
    </Button>
  );
};
