import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
