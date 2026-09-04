import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const PATCH = auth(async (req, { params }: any) => {
  try {
    // Verify admin role
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const reviewId = parseInt(resolvedParams.id);
    const { isFeatured } = await req.json();

    if (isFeatured) {
      // Check how many reviews are currently featured using raw SQL
      const result: any = await prisma.$queryRawUnsafe('SELECT COUNT(*) FROM "Review" WHERE "isFeatured" = true');
      const featuredCount = Number(result[0].count);

      if (featuredCount >= 6) {
        return NextResponse.json(
          { error: "Maximum of 6 reviews can be featured. Please unfeature a review first." },
          { status: 400 }
        );
      }
    }

    // Update using raw SQL
    await prisma.$executeRawUnsafe(
      'UPDATE "Review" SET "isFeatured" = $1 WHERE id = $2',
      isFeatured, reviewId
    );
    
    // Fetch the updated review to return it
    const updatedReviewArray: any = await prisma.$queryRawUnsafe('SELECT * FROM "Review" WHERE id = $1', reviewId);
    const updatedReview = updatedReviewArray[0];

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
});

export const DELETE = auth(async (req, { params }: any) => {
  try {
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const reviewId = parseInt(resolvedParams.id);

    await prisma.$executeRawUnsafe('DELETE FROM "Review" WHERE id = $1', reviewId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
});
