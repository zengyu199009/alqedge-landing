"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
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
  { value: "comprehensive", labelKey: "analyze.types.comprehensive.label", descriptionKey: "analyze.types.comprehensive.description" },
  { value: "fundamental", labelKey: "analyze.types.fundamental.label", descriptionKey: "analyze.types.fundamental.description" },
  { value: "technical", labelKey: "analyze.types.technical.label", descriptionKey: "analyze.types.technical.description" },
  { value: "sentiment", labelKey: "analyze.types.sentiment.label", descriptionKey: "analyze.types.sentiment.description" },
];

const EXAMPLE_TICKERS = ["AAPL", "MSFT", "NVDA"];

export default function AnalyzePage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
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
      setError(t("analyze.errors.emptyTicker"));
      return;
    }

    // Simple ticker validation
    if (!/^[A-Z]{1,5}$/.test(tickerClean)) {
      setError(t("analyze.errors.invalidTicker"));
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
        router.push(`/${locale}/login?redirect=/analyze`);
        return;
      }

      const result = await submitAnalysis({
        ticker: tickerClean,
        analysis_type: analysisType as any,
      });

      toast.success("Analysis started!");
      router.push(`/${locale}/analyze/${result.task_id}`);
    } catch (err: any) {
      const msg = err.message || t("analyze.errors.failedSubmit");
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
            {t("analyze.title")}
          </h1>
          <p className="text-gray-400">
            {t("analyze.subtitle")}
          </p>
        </div>

        {/* Quota hint for free users */}
        {plan === "free" && analysesRemaining !== null && (
          <div className="mb-4 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-sm">
            <span className="text-gray-400">
              {t("analyze.freePlan", {
                count: analysesRemaining,
                analyses: analysesRemaining === 1 ? t("analyze.analysisLabel") : t("analyze.analysesLabel"),
              })}
            </span>
            <Link href={`/${locale}/pricing`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 ml-2">
              {t("analyze.upgradePro")}
            </Link>
          </div>
        )}

        <Card className="bg-[#12122a] border-indigo-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              {t("analyze.newRequest")}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t("analyze.newRequestDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ticker" className="text-gray-300">
                  {t("analyze.tickerLabel")}
                </Label>
                <Input
                  id="ticker"
                  placeholder={t("analyze.tickerPlaceholder")}
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="bg-[#1e1e3a] border-indigo-500/20 text-white placeholder-gray-500 focus:border-indigo-400 text-lg font-mono uppercase"
                  maxLength={5}
                />
                <p className="text-xs text-gray-500">
                  {t("analyze.tickerHint")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type" className="text-gray-300">
                  {t("analyze.analysisType")}
                </Label>
                <Select
                  value={analysisType}
                  onValueChange={(value) => value && setAnalysisType(value)}
                >
                  <SelectTrigger
                    id="analysis-type"
                    className="bg-[#1e1e3a] border-indigo-500/20 text-white"
                  >
                    <SelectValue placeholder={t("analyze.analysisTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e3a] border-indigo-500/20 text-white">
                    {ANALYSIS_TYPES.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="hover:bg-indigo-500/10"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span>{t(type.labelKey)}</span>
                          <span className="text-[10px] text-gray-500 font-normal">
                            {t(type.descriptionKey)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 italic">
                  {t(ANALYSIS_TYPES.find((t) => t.value === analysisType)?.descriptionKey || "")}
                </p>
              </div>

              {/* Example tickers */}
              <div>
                <p className="text-xs text-gray-500 mb-2">{t("analyze.tryTicker")}</p>
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
                    {t("analyze.submitting")}
                  </span>
                ) : (
                  t("analyze.submit")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
            <div className="text-indigo-400 font-semibold text-sm mb-1">
              {t("analyze.infoCards.time.title")}
            </div>
            <p className="text-gray-500 text-xs">
              {t("analyze.infoCards.time.desc")}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
            <div className="text-indigo-400 font-semibold text-sm mb-1">
              {t("analyze.infoCards.sources.title")}
            </div>
            <p className="text-gray-500 text-xs">
              {t("analyze.infoCards.sources.desc")}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
            <div className="text-indigo-400 font-semibold text-sm mb-1">
              {t("analyze.infoCards.agents.title")}
            </div>
            <p className="text-gray-500 text-xs">
              {t("analyze.infoCards.agents.desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}