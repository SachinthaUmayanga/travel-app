import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hotels = await prisma.$queryRawUnsafe(`
      SELECT 
        h.id, h.image, h.name, h.location, h.price,
        ROUND(COALESCE(AVG(r.rating), 0), 1)::float as "rating", 
        COUNT(r.id)::int || ' Reviews' as "reviews" 
      FROM "Hotel" h 
      LEFT JOIN "Review" r ON h.id = r."hotelId" 
      GROUP BY h.id
      ORDER BY h.id DESC
    `);
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, location, price, image } = await req.json();
    const result: any = await prisma.$queryRawUnsafe(
      'INSERT INTO "Hotel" ("name", "location", "price", "image") VALUES ($1, $2, $3, $4) RETURNING *',
      name, location, price, image
    );
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to create hotel:", error);
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await prisma.hotel.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 });
  }
}
