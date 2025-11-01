import * as cheerio from 'cheerio';
import { CollectionBeforeChangeHook } from 'payload';

interface ParsedBeerData {
  title?: string;
  brewery?: string;
  style?: string;
  abv?: number;
  ibu?: number;
}

async function fetchBeerDataFromURL(url: string): Promise<ParsedBeerData> {
  try {
    // Fetch the HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.statusText}`);
      return {};
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to extract OpenGraph metadata first (most reliable)
    let beerName: string | undefined;
    let brewery: string | undefined;
    let style: string | undefined;
    let abv: number | undefined;
    let ibu: number | undefined;

    // For Untappd specifically, try to parse the page
    if (url.includes('untappd.com')) {
      beerName = $('.basic .name h1').first().text() || undefined;
      brewery = $('.basic .name .brewery').first().text() || undefined;
      style = $('.basic .name .style').first().text() || undefined;

      // Parse ABV and IBU
      const abvText = $('.details .abv').first().text();
      if (abvText) {
        abv = parseFloat(abvText);
      }

      const ibuText = $('.details .ibu').first().text();
      if (ibuText) {
        ibu = parseFloat(ibuText);
      }
    }

    return {
      title: beerName?.trim(),
      brewery: brewery?.trim(),
      style: style?.trim(),
      abv,
      ibu,
    };
  } catch (error) {
    console.error(`Error fetching beer data from ${url}:`, error);
    return {};
  }
}

export const beforeChangeMeetings: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only run for create or update operations
  if (operation !== 'create' && operation !== 'update') {
    return data;
  }

  // If there are no flights, return early
  if (!data.flights || !Array.isArray(data.flights)) {
    return data;
  }

  // Process each flight's items
  const updatedFlights = await Promise.all(
    data.flights.map(async (flight: any, flightIndex: number) => {
      if (!flight.items || !Array.isArray(flight.items)) {
        return flight;
      }

      const updatedItems = await Promise.all(
        flight.items.map(async (item: any, itemIndex: number) => {
          // Skip if URL is empty
          if (!item.url) {
            return item;
          }

          // Skip fetching if we already have the basic data (to avoid re-fetching unnecessarily)
          // Only fetch if missing title, brewery, or style (abv/ibu are optional)
          const needsFetch =
            !item.title || !item.brewery || !item.style || item.abv == null || item.ibu == null;
          const urlChanged =
            originalDoc && originalDoc.flights?.[flightIndex]?.items?.[itemIndex]?.url !== item.url;

          if (!needsFetch && !urlChanged) {
            return item;
          }

          // Fetch data from URL
          const parsedData = await fetchBeerDataFromURL(item.url);

          // Update item with parsed data, preferring existing values
          return {
            ...item,
            ...parsedData,
          };
        }),
      );

      return {
        ...flight,
        items: updatedItems,
      };
    }),
  );

  return {
    ...data,
    flights: updatedFlights,
  };
};
