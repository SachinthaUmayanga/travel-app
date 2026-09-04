import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';

    // Use raw SQL because Prisma Client isn't updated locally due to Windows lock
    let reviews: any;
    if (featured) {
      reviews = await prisma.$queryRawUnsafe('SELECT * FROM "Review" WHERE "isFeatured" = true ORDER BY id DESC');
    } else {
      reviews = await prisma.$queryRawUnsafe('SELECT * FROM "Review" ORDER BY id DESC');
    }
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

import { auth } from '@/auth';

export const POST = auth(async (req) => {
  try {
    console.log("POST /api/reviews hit. req.auth:", req.auth);
    if (!req.auth?.user) {
      console.log("No req.auth.user found. Returning 401.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = req.auth;

    const { name, review, rating, image } = await req.json();
    
    // Validate rating
    const parsedRating = parseInt(rating);
    const validRating = !isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 5;

    // Use session image or default image if none provided
    const userImage = session.user.image || image || "/images/u1.jpg";
    // Use session name if available, else from body
    const userName = session.user.name || name || "Anonymous";

    // Use raw SQL because Prisma Client isn't updated locally due to Windows lock
    const result: any = await prisma.$queryRawUnsafe(
      'INSERT INTO "Review" ("name", "review", "rating", "image", "isFeatured") VALUES ($1, $2, $3, $4, false) RETURNING *',
      userName, review, validRating, userImage
    );
    const newReview = result[0];

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
});

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await prisma.$executeRawUnsafe('DELETE FROM "Review" WHERE id = $1', parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
