import type { BeforeChangeHook } from 'payload';
import * as cheerio from 'cheerio';

interface ParsedBeerData {
  title?: string;
  brewery?: string;
  style?: string;
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
    let beerName = $('meta[property="og:title"]').attr('content') || 
                   $('meta[name="twitter:title"]').attr('content') || 
                   $('title').text();

    let brewery: string | undefined;
    let style: string | undefined;

    // For Untappd specifically, try to parse the page
    if (url.includes('untappd.com')) {
      // Untappd typically has the beer name and brewery in the page
      // Title usually follows pattern: "Beer Name | Brewery | Untappd"
      const titleParts = beerName.split('|');
      if (titleParts.length >= 2) {
        beerName = titleParts[0]?.trim() || beerName;
        brewery = titleParts[1]?.trim();
      }

      // Try to find brewery from common selectors
      if (!brewery) {
        brewery = 
          $('.beer-name a').first().text() ||
          $('.brewery-name a').text() ||
          $('a[href*="/brewery/"]').first().text() ||
          undefined;
      }

      // Try to find style from common selectors
      style =
        $('.beer-style').first().text().trim() ||
        $('[data-beer-style]').attr('data-beer-style') ||
        $('meta[property="beer:style"]').attr('content') ||
        undefined;
    }

    // Try to extract from JSON-LD structured data
    const jsonLdScripts = $('script[type="application/ld+json"]');
    jsonLdScripts.each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || '{}');
        if (data['@type'] === 'Product' || data['@type'] === 'FoodProduct') {
          if (data.name && !beerName) {
            beerName = data.name;
          }
          if (data.brand && data.brand.name && !brewery) {
            brewery = data.brand.name;
          }
          if (data.additionalProperty) {
            const styleProp = data.additionalProperty.find(
              (prop: any) => prop.name === 'Style' || prop.name === 'style'
            );
            if (styleProp && !style) {
              style = styleProp.value;
            }
          }
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    });

    return {
      title: beerName?.trim(),
      brewery: brewery?.trim(),
      style: style?.trim(),
    };
  } catch (error) {
    console.error(`Error fetching beer data from ${url}:`, error);
    return {};
  }
}

export const beforeChange: BeforeChangeHook = async ({ data, req, operation, originalDoc }) => {
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

          // Skip fetching if we already have brewery or style data (to avoid re-fetching unnecessarily)
          const needsFetch = !item.brewery && !item.style;

          if (!needsFetch && operation === 'update' && originalDoc) {
            // Double-check if this is actually a new item or URL changed
            const originalFlight = originalDoc.flights?.[flightIndex];
            const originalItem = originalFlight?.items?.[itemIndex];
            const isNewItem = !originalItem;
            const urlChanged = originalItem && originalItem.url !== item.url;
            
            if (!isNewItem && !urlChanged) {
              // Item exists, URL hasn't changed, and we have data - skip fetch
              return item;
            }
          }

          // Fetch data from URL
          const parsedData = await fetchBeerDataFromURL(item.url);

          // Update item with parsed data, preferring existing values
          return {
            ...item,
            title: item.title || parsedData.title || '',
            brewery: item.brewery || parsedData.brewery || undefined,
            style: item.style || parsedData.style || undefined,
          };
        })
      );

      return {
        ...flight,
        items: updatedItems,
      };
    })
  );

  return {
    ...data,
    flights: updatedFlights,
  };
};

