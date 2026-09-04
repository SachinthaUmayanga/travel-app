import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, review, rating, image } = await req.json();
    
    // Validate rating
    const parsedRating = parseInt(rating);
    const validRating = !isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 5;

    // Use default image if none provided
    const userImage = image || "/images/u1.jpg";

    // @ts-ignore - Prisma client may not be updated locally due to Windows lock
    const newReview = await prisma.review.create({
      data: {
        name,
        review,
        rating: validRating,
        image: userImage
      }
    });
    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await prisma.review.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
