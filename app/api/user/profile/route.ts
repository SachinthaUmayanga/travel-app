import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const GET = auth(async (req) => {
  try {
    const session = req.auth;

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role === 'admin') {
      return NextResponse.json({ name: 'Admin', role: 'admin' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

import { getToken } from 'next-auth/jwt';

export async function PUT(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized: Session Token Missing' }, { status: 401 });
    }

    if (token.role === 'admin') {
      return NextResponse.json({ error: 'Admin details cannot be updated here' }, { status: 400 });
    }

    const data = await req.json();

    if (!data.name || data.name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updateData = {
      name: data.name,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      dob: data.dob ? new Date(data.dob) : null,
      emergencyContact: data.emergencyContact || null,
      preferredCurrency: data.preferredCurrency || "USD",
    };

    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
