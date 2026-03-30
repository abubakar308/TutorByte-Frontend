import { NextRequest, NextResponse } from "next/server";
import { getRouteOwner, isAuthRoute } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const decoded = token ? jwtUtils.decodedToken(token) : null;
  const isValidToken = decoded && decoded.exp && decoded.exp * 1000 > Date.now();
  const isAuth = isAuthRoute(pathname);
  const routeOwner = getRouteOwner(pathname);

  // Public routes
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // Auth routes with valid token - redirect to dashboard
  if (isAuth && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected routes without token - redirect to login
  if (!isValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role mismatch - redirect to user's dashboard
  if (routeOwner !== decoded?.role && routeOwner !== "COMMON") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher : [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}