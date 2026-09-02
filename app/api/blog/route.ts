import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch Posts Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/blog (Protected by middleware for Admins only)
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.content || !data.image || !data.author) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        author: data.author,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Create Post Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
