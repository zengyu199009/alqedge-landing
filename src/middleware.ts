import { NextRequest, NextResponse } from "next/server";

// US-only landing page middleware
// Blocks non-US visitors with a redirect to /explain.html
// Uses Vercel Edge / GeoIP headers

const US_ONLY = true;
const US_COUNTRY_CODE = "US";

export function middleware(request: NextRequest) {
  // Skip middleware for the explain page itself to avoid redirect loops
  if (request.nextUrl.pathname.startsWith("/explain")) {
    return NextResponse.next();
  }

  // Skip static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  if (US_ONLY) {
    // Vercel provides geo information via request headers
    // cf-ipcountry is set by Cloudflare; Vercel uses x-vercel-ip-country
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "";

    // If we can detect the country and it's not US, redirect
    if (country && country !== US_COUNTRY_CODE) {
      const url = new URL("/explain", request.url);
      return NextResponse.redirect(url);
    }

    // For local development or when geo data isn't available,
    // we allow access (will be handled by Cloudflare in production)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
