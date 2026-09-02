import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany();
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
