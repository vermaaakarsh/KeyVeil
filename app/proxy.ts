import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const publicRoutes = ['/sign-up', '/sign-in'];
const protectedRoutes = ['/'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};
