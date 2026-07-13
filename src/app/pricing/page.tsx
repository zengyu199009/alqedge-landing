"use client";

import { useState } from "react";
import Link from "next/link";
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

const MONTHLY_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with basic analysis",
    features: [
      "5 stock analyses per 30 days",
      "Fundamental analysis only",
      "Basic report format",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/register?plan=free",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For serious investors",
    features: [
      "60 analyses per hour (soft cap)",
      "All analysis types",
      "Full detailed reports with citations",
      "7-day free trial",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "$49",
    description: "For teams and small funds",
    features: [
      "Up to 5 seats",
      "300 analyses per hour",
      "All analysis types",
      "Full detailed reports with citations",
      "Shared watchlists",
      "Priority support",
    ],
    cta: "Contact Sales",
    href: "mailto:support@alqedge.com",
  },
];

const ANNUAL_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with basic analysis",
    features: [
      "5 stock analyses per 30 days",
      "Fundamental analysis only",
      "Basic report format",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/register?plan=free",
  },
  {
    name: "Pro",
    price: "$190",
    description: "For serious investors — save ~17%",
    features: [
      "60 analyses per hour (soft cap)",
      "All analysis types",
      "Full detailed reports with citations",
      "7-day free trial",
      "Priority email support",
      "Billed annually ($190/year)",
    ],
    cta: "Start Free Trial",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "Best Value",
  },
  {
    name: "Team",
    price: "$490",
    description: "For teams and small funds — save ~17%",
    features: [
      "Up to 5 seats",
      "300 analyses per hour",
      "All analysis types",
      "Full detailed reports with citations",
      "Shared watchlists",
      "Priority support",
      "Billed annually ($490/year)",
    ],
    cta: "Contact Sales",
    href: "mailto:support@alqedge.com",
  },
];

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
  const [annual, setAnnual] = useState(false);
  const [spotsRemaining] = useState(42); // Simulated — replace with real API call

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0a0a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
            🎉 Early Bird Pricing — {spotsRemaining} of 50 spots remaining
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            First <span className="text-amber-300 font-bold">50</span> Pro
            subscribers lock in{" "}
            <span className="text-amber-300 font-bold">$9/month forever</span>.
            Regular price: $19/month after the first 50.
          </p>
          {/* Urgency bar */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Spots filled: {50 - spotsRemaining}</span>
              <span>Remaining: {spotsRemaining}</span>
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
            Monthly
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
            Annual
          </span>
          {annual && (
            <span className="text-xs text-emerald-400 font-medium">Save ~17%</span>
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
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
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
                    Cancel anytime. No charge.
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. You can cancel your subscription at any time from your account settings. If you cancel during the 7-day free trial, you won't be charged.",
              },
              {
                q: "What payment methods do you accept?",
                a: "Payments are processed securely by Waffo Pancake (Waffo.com Limited), our Merchant of Record. All major credit cards are accepted.",
              },
              {
                q: "Is there a money-back guarantee?",
                a: "Yes. First-time Pro subscribers get a 7-day money-back guarantee. Contact support within 7 days of your first charge if you've used fewer than 3 analyses.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Your account data is retained for 30 days after cancellation. After that, it is deleted in accordance with our Privacy Policy.",
              },
            ].map((faq, i) => (
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
