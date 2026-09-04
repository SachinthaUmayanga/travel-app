import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  // Protect all /admin routes except /admin/login
  if (nextUrl.pathname.startsWith('/admin') && nextUrl.pathname !== '/admin/login') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', nextUrl)); // Unauthorized regular users go to home
    }
  }

  // Also protect API routes that mutate data (POST, PUT, DELETE)
  if (nextUrl.pathname.startsWith('/api/') && req.method !== 'GET') {
    // NextAuth paths
    if (nextUrl.pathname.startsWith('/api/auth/')) return NextResponse.next();
    
    // Allow users to update their own profile
    if (nextUrl.pathname === '/api/user/profile' && isLoggedIn) return NextResponse.next();
    
    // Allow users to submit reviews
    if (nextUrl.pathname === '/api/reviews' && req.method === 'POST' && isLoggedIn) return NextResponse.next();
    
    // Otherwise, require admin for all other mutations (like adding tours, hotels, etc.)
    if (!isLoggedIn || role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
