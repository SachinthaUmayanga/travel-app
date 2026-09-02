import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany();
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const hotel = await prisma.hotel.create({ data });
    return NextResponse.json(hotel);
  } catch (error) {
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
