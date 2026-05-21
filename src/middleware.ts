import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'moviai_admin_jwt';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;

  // Gate /admin/* — without a token, bounce to /login
  if (pathname.startsWith('/admin') && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // If logged in and visiting /login, push to dashboard
  if (pathname === '/login' && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
