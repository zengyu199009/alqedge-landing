"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    router.push("/");
    router.refresh();
  };

  const isLanding = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-indigo-500/10 backdrop-blur-sm ${
        isLanding ? "bg-[#0a0a1a]/80" : "bg-[#0a0a1a]/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">AlphaSync</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {isLanding ? (
              <>
                <a
                  href="#features"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Features
                </a>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`text-sm transition-colors ${
                    pathname === "/"
                      ? "text-indigo-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/analyze"
                  className={`text-sm transition-colors ${
                    pathname.startsWith("/analyze")
                      ? "text-indigo-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Analyze
                </Link>
                <Link
                  href="/pricing"
                  className={`text-sm transition-colors ${
                    pathname === "/pricing"
                      ? "text-indigo-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Pricing
                </Link>
              </>
            )}

            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {user.email?.split("@")[0] || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#12122a] border-indigo-500/20 text-gray-200"
                >
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-indigo-500/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 hover:text-red-300"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !loading && (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
                      Get Started
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
                    Features
                  </a>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    Pricing
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/analyze"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    Analyze
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    Pricing
                  </Link>
                </>
              )}

              {!loading && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-200 py-2"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="text-sm text-red-400 hover:text-red-300 py-2 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                !loading && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-400 hover:text-gray-200 py-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 py-2"
                    >
                      Get Started
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
