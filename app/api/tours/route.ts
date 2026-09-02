import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tours = await prisma.tour.findMany();
    return NextResponse.json(tours);
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const tour = await prisma.tour.create({ data });
    return NextResponse.json(tour);
  } catch (error) {
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
