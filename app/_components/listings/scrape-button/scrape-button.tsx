import { categories, locations } from "kijiji-scraper";
import { useState } from "react";
import { Button } from "../../shared";

export const ScrapeButton = () => {
  const [scraping, setScraping] = useState(false);

  const scrapeListings = async () => {
    setScraping(true);
    // TODO: use env var for api url
    await fetch(`${process.env.NEXT_PUBLIC_API_URI}cron/scrape`, {
      method: "GET",
    });
    setScraping(false);
  };
  return (
    <Button onClick={scrapeListings} disabled={scraping}>
      Scrape
    </Button>
  );
};
