import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const { pathname } = req.nextUrl;

  const protectedPaths = ['/dashboard', '/journal', '/calendar', '/community', '/profile'];
  
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdminPath = pathname.startsWith('/admin');

  if (isProtectedPath || isAdminPath) {
    if (!token) {
      const url = new URL('/login', req.url);
      return NextResponse.redirect(url);
    }
    
    if (token.status !== 'ACTIVE') {
      const url = new URL('/login', req.url);
      // In case they logged in successfully before their status was revoked to PENDING/REJECTED
      url.searchParams.set('error', 'Status akun tidak aktif atau masih menunggu persetujuan.');
      return NextResponse.redirect(url);
    }

    if (isAdminPath && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
