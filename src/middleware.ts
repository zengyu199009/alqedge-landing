import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// US-only landing page middleware
// Blocks non-US visitors with a redirect to /explain
// Uses Vercel Edge / GeoIP headers

const US_ONLY = true;
const US_COUNTRY_CODE = "US";

export async function middleware(request: NextRequest) {
  // Skip middleware for static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Handle Supabase auth session
  const supabaseResponse = await updateSession(request);

  // Skip GeoIP for legal and explain pages to avoid redirect loops
  if (
    request.nextUrl.pathname.startsWith("/explain") ||
    request.nextUrl.pathname.startsWith("/terms") ||
    request.nextUrl.pathname.startsWith("/privacy")
  ) {
    return supabaseResponse;
  }

  if (US_ONLY) {
    // Vercel provides geo information via request headers
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "";

    // If we can detect the country and it's not US, redirect
    if (country && country !== US_COUNTRY_CODE) {
      const url = new URL("/explain", request.url);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
