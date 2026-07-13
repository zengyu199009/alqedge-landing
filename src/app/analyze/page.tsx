"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { submitAnalysis } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ANALYSIS_TYPES = [
  { value: "comprehensive", label: "Comprehensive (All)", description: "Full analysis combining fundamentals, technicals, and sentiment for a complete picture" },
  { value: "fundamental", label: "Fundamental Analysis", description: "Deep dive into financial statements, revenue, earnings, and valuation metrics" },
  { value: "technical", label: "Technical Analysis", description: "Price trends, support/resistance levels, RSI, MACD, and moving averages" },
  { value: "sentiment", label: "Sentiment Analysis", description: "News sentiment, social media buzz, and market mood around the ticker" },
];

const EXAMPLE_TICKERS = ["AAPL", "MSFT", "NVDA"];

export default function AnalyzePage() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [analysisType, setAnalysisType] = useState("comprehensive");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysesRemaining, setAnalysesRemaining] = useState<number | null>(null);
  const [plan, setPlan] = useState<"free" | "pro" | "team">("free");

  // Fetch user's plan and remaining analyses
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${API_URL}/user/plan`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPlan(data.plan || "free");
          setAnalysesRemaining(data.analyses_remaining ?? null);
        }
      } catch {
        setPlan("free");
        setAnalysesRemaining(3);
      }
    };
    fetchQuota();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const tickerClean = ticker.trim().toUpperCase();
    if (!tickerClean) {
      setError("Please enter a stock ticker");
      return;
    }

    // Simple ticker validation
    if (!/^[A-Z]{1,5}$/.test(tickerClean)) {
      setError(
        "Invalid ticker symbol. Enter 1-5 uppercase letters (e.g., AAPL, MSFT, GOOGL)"
      );
      return;
    }

    setLoading(true);

    try {
      // Check auth
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/analyze");
        return;
      }

      const result = await submitAnalysis({
        ticker: tickerClean,
        analysis_type: analysisType as any,
      });

      toast.success("Analysis started!");
      router.push(`/analyze/${result.task_id}`);
    } catch (err: any) {
      const msg = err.message || "Failed to submit analysis";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0a0a1a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Stock Analysis
          </h1>
          <p className="text-gray-400">
            Enter a US stock ticker to get an AI-powered research report
          </p>
        </div>

        {/* Quota hint for free users */}
        {plan === "free" && analysesRemaining !== null && (
          <div className="mb-4 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-sm">
            <span className="text-gray-400">
              Free plan:{" "}
              <span className="text-indigo-300 font-semibold">{analysesRemaining}</span>{" "}
              {analysesRemaining === 1 ? "analysis" : "analyses"} remaining this month.
            </span>
            <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 ml-2">
              Upgrade to Pro
            </Link>
          </div>
        )}

        <Card className="bg-[#12122a] border-indigo-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              New Analysis Request
            </CardTitle>
            <CardDescription className="text-gray-400">
              Our 3 AI analysts will analyze SEC filings, market data, and
              news sentiment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ticker" className="text-gray-300">
                  Stock Ticker
                </Label>
                <Input
                  id="ticker"
                  placeholder="e.g., AAPL, MSFT, GOOGL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="bg-[#1e1e3a] border-indigo-500/20 text-white placeholder-gray-500 focus:border-indigo-400 text-lg font-mono uppercase"
                  maxLength={5}
                />
                <p className="text-xs text-gray-500">
                  Enter a US stock ticker symbol (1-5 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type" className="text-gray-300">
                  Analysis Type
                </Label>
                <Select
                  value={analysisType}
                  onValueChange={(value) => value && setAnalysisType(value)}
                >
                  <SelectTrigger
                    id="analysis-type"
                    className="bg-[#1e1e3a] border-indigo-500/20 text-white"
                  >
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e3a] border-indigo-500/20 text-white">
                    {ANALYSIS_TYPES.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="hover:bg-indigo-500/10"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span>{type.label}</span>
                          <span className="text-[10px] text-gray-500 font-normal">
                            {type.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Tooltip-style description for selected type */}
                <p className="text-xs text-gray-500 italic">
                  {ANALYSIS_TYPES.find((t) => t.value === analysisType)?.description}
                </p>
              </div>

              {/* Example tickers */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Try a ticker:</p>
                <div className="flex gap-2">
                  {EXAMPLE_TICKERS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTicker(t)}
                      className="px-3 py-1.5 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 text-xs font-mono transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </span>
                ) : (
                  "Start Analysis"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
            <div className="text-indigo-400 font-semibold text-sm mb-1">
              ⏱ ~3 minutes
            </div>
            <p className="text-gray-500 text-xs">
              Typical analysis time for comprehensive reports
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
            <div className="text-indigo-400 font-semibold text-sm mb-1">
              📊 4 data sources
            </div>
            <p className="text-gray-500 text-xs">
              SEC EDGAR, Finnhub, FRED, and news sentiment
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
            <div className="text-indigo-400 font-semibold text-sm mb-1">
              🤖 3 AI agents
            </div>
            <p className="text-gray-500 text-xs">
              Fundamental, technical, and sentiment in parallel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
