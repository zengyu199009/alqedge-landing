"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="py-12 bg-[#0a0a1a] border-t border-indigo-500/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 text-sm">
            {t("footer.copyright")}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href={`/${locale}/privacy`}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {t("nav.pricing")}
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-indigo-500/5 text-center">
          <p className="text-gray-400 text-sm mb-3">
            {t("footer.contact")}:{" "}
            <a
              href="mailto:support@alqedge.com"
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              support@alqedge.com
            </a>
          </p>
          <p className="text-amber-400/80 text-xs font-medium">
            {t("footer.usOnly")}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}