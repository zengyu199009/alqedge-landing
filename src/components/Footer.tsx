import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 bg-[#0a0a1a] border-t border-indigo-500/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 text-sm">
            &copy; 2026 AlphaSync. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/pricing"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-indigo-500/5 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Contact:{" "}
            <a
              href="mailto:support@alqedge.com"
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              support@alqedge.com
            </a>
          </p>
          <p className="text-amber-400/80 text-xs font-medium">
            ⚠️ AlphaSync only serves customers located in the United States.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            This tool provides data-driven analysis only and does not constitute
            investment advice. All investment decisions carry risk. Past
            performance does not guarantee future results. AlphaSync is not a
            registered investment adviser.
          </p>
        </div>
      </div>
    </footer>
  );
}
