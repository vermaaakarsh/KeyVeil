import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const publicRoutes = ["/sign-up", "/sign-in"];
const protectedRoutes = ["/"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Type", "application/json");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }
  if (isPublicRoute && token && request.nextUrl.pathname.startsWith("/sign")) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
