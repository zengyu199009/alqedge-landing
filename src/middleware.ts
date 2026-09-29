import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/navigation";

// 制裁国家列表 — 这些国家的用户将被限制访问
// 基于 US 制裁法规（OFAC）
const SANCTIONED_COUNTRIES = new Set([
  "CU", // 古巴
  "IR", // 伊朗
  "KP", // 朝鲜
  "SY", // 叙利亚
  "RU", // 俄罗斯
]);

// 克里米亚地区不属于独立国家代码，通过 CF-IPCountry 无法单独识别

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

  // opennext/Cloudflare 不把 next-intl middleware 写在 rewrite request 上的
  // X-NEXT-INTL-LOCALE 头透传到 server handler，导致 getRequestConfig 的
  // requestLocale 为空、中文回退英文。
  // 这里把 locale 写到响应头上，opennext 的 applyMiddlewareHeaders 会把它
  // 转成 x-middleware-response- 前缀透传给 server，再由 server 还原成
  // x-next-intl-locale 请求头，从而让 getRequestLocale 读到正确 locale。
  const localeMatch = pathname.match(/^\/(en|zh)(?:\/|$)/);
  const locale = localeMatch ? localeMatch[1] : defaultLocale;

  const setLocaleHeader = (res: NextResponse) => {
    res.headers.set("x-next-intl-locale", locale);
    return res;
  };

  // Handle Supabase auth session on the (possibly rewritten) path
  const supabaseResponse = await updateSession(request);
  setLocaleHeader(supabaseResponse);

  // Skip GeoIP for legal and explain pages to avoid redirect loops
  const pathWithoutLocale = pathname.replace(/^\/(en|zh)/, "");
  if (
    pathWithoutLocale.startsWith("/explain") ||
    pathWithoutLocale.startsWith("/terms") ||
    pathWithoutLocale.startsWith("/privacy")
  ) {
    return supabaseResponse;
  }

  // 制裁国家限制
  // 通过 Cloudflare 或 Vercel 的 GeoIP header 检测访客国家
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";

  // 如果检测到国家且属于制裁国家列表，重定向到限制页面
  if (country && SANCTIONED_COUNTRIES.has(country)) {
    const url = new URL("/explain", request.url);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};