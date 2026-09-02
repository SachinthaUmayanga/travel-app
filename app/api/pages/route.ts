import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pages?pageName=about
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageName = searchParams.get('pageName');

    if (!pageName) {
      return NextResponse.json({ error: 'pageName is required' }, { status: 400 });
    }

    const page = await prisma.pageContent.findUnique({
      where: { pageName },
    });

    if (!page) {
      return NextResponse.json({ title: '', content: '' }); // Return empty default if not created yet
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Fetch Page Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/pages (Protected by middleware for Admins only)
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.pageName || !data.title || data.content === undefined) {
      return NextResponse.json({ error: 'pageName, title, and content are required' }, { status: 400 });
    }

    const updatedPage = await prisma.pageContent.upsert({
      where: { pageName: data.pageName },
      update: {
        title: data.title,
        content: data.content,
      },
      create: {
        pageName: data.pageName,
        title: data.title,
        content: data.content,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Update Page Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
