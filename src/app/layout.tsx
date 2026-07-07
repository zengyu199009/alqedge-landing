import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlphaSync — AI-Powered US Stock Analysis",
  description:
    "Real-time data. Multi-Agent collaboration. Personalized insights. Get a structured research report with SEC-sourced citations in 3 minutes.",
  openGraph: {
    title: "AlphaSync — AI-Powered US Stock Analysis",
    description:
      "Real-time data. Multi-Agent collaboration. Personalized insights. Get a structured research report with SEC-sourced citations in 3 minutes.",
    type: "website",
    url: "https://alqedge.com",
    siteName: "AlphaSync",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaSync — AI-Powered US Stock Analysis",
    description:
      "Real-time data. Multi-Agent collaboration. Personalized insights. Get a structured research report with SEC-sourced citations in 3 minutes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
