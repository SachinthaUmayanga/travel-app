import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tours = await prisma.$queryRawUnsafe(`
      SELECT 
        t.id, t.image, t.title, t.location, t.time, t.type, t.price, t.country,
        ROUND(COALESCE(AVG(r.rating), 0), 1)::float as "rating", 
        COUNT(r.id)::int || ' Reviews' as "reviews" 
      FROM "Tour" t 
      LEFT JOIN "Review" r ON t.id = r."tourId" 
      GROUP BY t.id
      ORDER BY t.id DESC
    `);
    return NextResponse.json(tours);
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, location, country, time, type, price, image } = await req.json();
    const result: any = await prisma.$queryRawUnsafe(
      'INSERT INTO "Tour" ("title", "location", "country", "time", "type", "price", "image") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      title, location, country, time, type, price, image
    );
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to create tour:", error);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await prisma.tour.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
