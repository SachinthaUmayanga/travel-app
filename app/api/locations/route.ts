import { NextResponse } from 'next/server';
import { Country, City } from 'country-state-city';

// Memory cache to avoid recalculating massive arrays on every keystroke
let allCountries: string[] = [];
let allCities: string[] = [];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    if (!q) {
      return NextResponse.json([]);
    }

    // Initialize cache on first request
    if (allCountries.length === 0) {
      allCountries = Country.getAllCountries().map(c => c.name);
    }
    if (allCities.length === 0) {
      // deduplicate cities (some cities have same name in different states/countries)
      allCities = Array.from(new Set(City.getAllCities().map(c => c.name)));
    }

    // Find matches
    const matchedCountries = allCountries
      .filter(c => c.toLowerCase().startsWith(q) || c.toLowerCase().includes(` ${q}`))
      .slice(0, 5);

    const matchedCities = allCities
      .filter(c => c.toLowerCase().startsWith(q) || c.toLowerCase().includes(` ${q}`))
      .slice(0, 10);

    // Combine, deduplicate, and limit to 12 suggestions total
    const combined = Array.from(new Set([...matchedCountries, ...matchedCities])).slice(0, 12);

    return NextResponse.json(combined);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
