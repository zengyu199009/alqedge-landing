"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  // Strip locale prefix to get the actual path
  const pathWithoutLocale = pathname.replace(/^\/(en|zh)/, "") || "/";
  const isLanding = pathWithoutLocale === "/";

  // Build locale-switch URLs
  const switchLocale = (newLocale: string) => {
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-indigo-500/10 backdrop-blur-sm ${
        isLanding ? "bg-[#0a0a1a]/80" : "bg-[#0a0a1a]/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">{t("site.brand")}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {isLanding ? (
              <>
                <a
                  href="#features"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {t("nav.features")}
                </a>
                <Link
                  href={`/${locale}/pricing`}
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {t("nav.pricing")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}`}
                  className={`text-sm transition-colors ${
                    pathWithoutLocale === "/"
                      ? "text-indigo-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  href={`/${locale}/analyze`}
                  className={`text-sm transition-colors ${
                    pathWithoutLocale.startsWith("/analyze")
                      ? "text-indigo-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {t("nav.analyze")}
                </Link>
                <Link
                  href={`/${locale}/pricing`}
                  className={`text-sm transition-colors ${
                    pathWithoutLocale === "/pricing"
                      ? "text-indigo-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {t("nav.pricing")}
                </Link>
              </>
            )}

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-gray-400 hover:text-gray-200 gap-1 outline-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                  {locale === "en" ? "EN" : "中文"}
                </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#12122a] border-indigo-500/20 text-gray-200"
              >
                <DropdownMenuItem
                  onClick={() => switchLocale("en")}
                  className={locale === "en" ? "text-indigo-300" : ""}
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLocale("zh")}
                  className={locale === "zh" ? "text-indigo-300" : ""}
                >
                  🇨🇳 中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {user.email?.split("@")[0] || t("nav.account")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#12122a] border-indigo-500/20 text-gray-200"
                >
                  <DropdownMenuItem
                    onClick={() => router.push(`/${locale}/dashboard`)}
                  >
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/${locale}/dashboard`)}
                  >
                    {t("nav.settings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-indigo-500/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 hover:text-red-300"
                  >
                    {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !loading && (
                <div className="flex items-center gap-3">
                  <Link href={`/${locale}/login`}>
                    <Button
                      variant="ghost"
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {t("nav.signIn")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/register`}>
                    <Button className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
                      {t("nav.getStarted")}
                    </Button>
                  </Link>
                </div>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-indigo-500/10 pt-4">
            <nav className="flex flex-col gap-3">
              {isLanding ? (
                <>
                  <a
                    href="#features"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    {t("nav.features")}
                  </a>
                  <Link
                    href={`/${locale}/pricing`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    {t("nav.pricing")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    {t("nav.home")}
                  </Link>
                  <Link
                    href={`/${locale}/analyze`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    {t("nav.analyze")}
                  </Link>
                  <Link
                    href={`/${locale}/pricing`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    {t("nav.pricing")}
                  </Link>
                </>
              )}

              {/* Mobile language switcher */}
              <div className="border-t border-indigo-500/10 pt-3 mt-1">
                <p className="text-xs text-gray-500 mb-2 px-2">{t("language.switch")}</p>
                <div className="flex gap-2 px-2">
                  <button
                    onClick={() => {
                      switchLocale("en");
                      setMobileOpen(false);
                    }}
                    className={`flex-1 text-sm py-2 rounded-md border ${
                      locale === "en"
                        ? "border-indigo-500/40 text-indigo-300 bg-indigo-500/10"
                        : "border-indigo-500/10 text-gray-400"
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => {
                      switchLocale("zh");
                      setMobileOpen(false);
                    }}
                    className={`flex-1 text-sm py-2 rounded-md border ${
                      locale === "zh"
                        ? "border-indigo-500/40 text-indigo-300 bg-indigo-500/10"
                        : "border-indigo-500/10 text-gray-400"
                    }`}
                  >
                    🇨🇳 中文
                  </button>
                </div>
              </div>

              {!loading && user ? (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="text-sm text-red-400 hover:text-red-300 py-2 text-left"
                  >
                    {t("nav.signOut")}
                  </button>
                </>
              ) : (
                !loading && (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-400 hover:text-gray-200 py-2"
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 py-2"
                    >
                      {t("nav.getStarted")}
                    </Link>
                  </>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}