"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default function PricingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [annual, setAnnual] = useState(false);
  const [spotsRemaining] = useState(42); // Simulated — replace with real API call

  const p = t.raw("pricing.plans");

  const MONTHLY_PLANS: PricingPlan[] = [
    {
      name: p.free.name,
      price: p.free.price,
      description: p.free.description,
      features: p.free.features,
      cta: p.free.cta,
      href: `/${locale}/register?plan=free`,
    },
    {
      name: p.pro.name,
      price: p.pro.price,
      description: p.pro.description,
      features: p.pro.features,
      cta: p.pro.cta,
      href: `/${locale}/register?plan=pro`,
      highlighted: true,
      badge: p.pro.badge,
    },
    {
      name: p.team.name,
      price: p.team.price,
      description: p.team.description,
      features: p.team.features,
      cta: p.team.cta,
      href: `mailto:support@alqedge.com`,
    },
  ];

  const ANNUAL_PLANS: PricingPlan[] = [
    {
      name: p.free.name,
      price: p.free.price,
      description: p.free.description,
      features: p.free.features,
      cta: p.free.cta,
      href: `/${locale}/register?plan=free`,
    },
    {
      name: p.pro.name,
      price: p.pro.annual.price,
      description: p.pro.annual.description,
      features: p.pro.annual.features,
      cta: p.pro.cta,
      href: `/${locale}/register?plan=pro`,
      highlighted: true,
      badge: p.pro.annual.badge,
    },
    {
      name: p.team.name,
      price: p.team.annual.price,
      description: p.team.annual.description,
      features: p.team.annual.features,
      cta: p.team.cta,
      href: `mailto:support@alqedge.com`,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0a0a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
            {t("pricing.earlyBird", { spots: spotsRemaining })}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("pricing.title")}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t("pricing.subtitle", { count: 50, price: "$9/month", regular: "$19/month" })}
          </p>
          {/* Urgency bar */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{t("pricing.spotsFilled", { filled: 50 - spotsRemaining })}</span>
              <span>{t("pricing.spotsRemaining", { remaining: spotsRemaining })}</span>
            </div>
            <div className="w-full h-2 bg-[#1e1e3a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${((50 - spotsRemaining) / 50) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className={`text-sm ${!annual ? "text-white font-medium" : "text-gray-500"}`}>
            {t("pricing.monthly")}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              annual ? "bg-indigo-600" : "bg-[#1e1e3a]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                annual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-white font-medium" : "text-gray-500"}`}>
            {t("pricing.annual")}
          </span>
          {annual && (
            <span className="text-xs text-emerald-400 font-medium">{t("pricing.savePercent")}</span>
          )}
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {(annual ? ANNUAL_PLANS : MONTHLY_PLANS).map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-[#12122a] border ${
                plan.highlighted
                  ? "border-indigo-500/40 shadow-lg shadow-indigo-500/10 scale-[1.02] md:scale-105"
                  : "border-indigo-500/10"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className={`text-center ${plan.badge ? "pt-8" : ""}`}>
                <CardTitle className="text-xl text-white">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 ml-1">{t("pricing.perMonth")}</span>
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex-col">
                {plan.href.startsWith("mailto:") ? (
                  <a href={plan.href} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                ) : (
                  <Link href={plan.href} className="w-full">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                          : "border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
                {plan.highlighted && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {t("pricing.cancelAnytime")}
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {t("pricing.faqTitle")}
          </h2>

          <div className="space-y-4">
            {(t.raw("pricing.faq") as Array<{q: string; a: string}>).map((faq: {q: string; a: string}, i: number) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10"
              >
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}