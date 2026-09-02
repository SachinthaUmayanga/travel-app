import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const popular = searchParams.get('popular');

    let whereClause = {};
    let takeClause = undefined;

    if (popular === 'true') {
      whereClause = { isPopular: true };
      takeClause = 10;
    }

    const destinations = await prisma.destination.findMany({
      where: whereClause,
      take: takeClause,
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const destination = await prisma.destination.create({ data });
    return NextResponse.json(destination);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await prisma.destination.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, isPopular } = await req.json();
    
    if (id === undefined || isPopular === undefined) {
      return NextResponse.json({ error: "id and isPopular are required" }, { status: 400 });
    }

    // Check if we are trying to set a new destination to popular
    if (isPopular) {
      const popularCount = await prisma.destination.count({
        where: { isPopular: true },
      });
      
      if (popularCount >= 10) {
        return NextResponse.json({ error: "Maximum of 10 popular destinations allowed" }, { status: 400 });
      }
    }

    const updated = await prisma.destination.update({
      where: { id: Number(id) },
      data: { isPopular: Boolean(isPopular) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update destination:", error);
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}
