import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/navigation";

// US-only landing page middleware
// Blocks non-US visitors with a redirect to /explain
// Uses Vercel Edge / GeoIP headers

const US_ONLY = true;
const US_COUNTRY_CODE = "US";

// Create the next-intl middleware for locale handling
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js"
  ) {
    return NextResponse.next();
  }

  // The explain page must be accessible without locale prefix
  // (GeoIP redirect from middleware sends users here)
  if (pathname === "/explain") {
    return NextResponse.next();
  }

  // Handle locale detection and redirect via next-intl
  // This will redirect root / to /en or /zh based on browser detection
  const intlResponse = intlMiddleware(request);

  // If next-intl redirects (e.g., / -> /en), return that redirect
  // But if it's a rewrite (stays on same path), continue with auth
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // Handle Supabase auth session on the (possibly rewritten) path
  const supabaseResponse = await updateSession(request);

  // Skip GeoIP for legal and explain pages to avoid redirect loops
  const pathWithoutLocale = pathname.replace(/^\/(en|zh)/, "");
  if (
    pathWithoutLocale.startsWith("/explain") ||
    pathWithoutLocale.startsWith("/terms") ||
    pathWithoutLocale.startsWith("/privacy")
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