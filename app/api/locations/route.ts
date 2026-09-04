import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    const queryStr = `%${q}%`;

    const locations: any[] = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT location FROM (
        SELECT country AS location FROM "Destination"
        UNION
        SELECT location FROM "Hotel"
        UNION
        SELECT location FROM "Tour"
      ) AS locs
      WHERE location ILIKE $1
      ORDER BY location ASC
      LIMIT 10
    `, queryStr);

    return NextResponse.json(locations.map(l => l.location));
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
