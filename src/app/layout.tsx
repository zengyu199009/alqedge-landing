import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AlphaSync — AI-Powered US Stock Analysis",
  description:
    "Real-time data. 3 AI Analysts working in parallel. Personalized insights. Get a structured research report with SEC-sourced citations in 3 minutes.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AlphaSync — AI-Powered US Stock Analysis",
    description:
      "Real-time data. 3 AI Analysts working in parallel. Personalized insights. Get a structured research report with SEC-sourced citations in 3 minutes.",
    type: "website",
    url: "https://alqedge.com",
    siteName: "AlphaSync",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaSync — AI-Powered US Stock Analysis",
    description:
      "Real-time data. 3 AI Analysts working in parallel. Personalized insights. Get a structured research report with SEC-sourced citations in 3 minutes.",
  },
};

type Props = {
  children: ReactNode;
};

// Root layout — just passes through to [locale]/layout.tsx
// next-intl handles the locale-based routing
export default function RootLayout({ children }: Props) {
  return children;
}