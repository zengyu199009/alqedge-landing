"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createAnalysisEventSource, getAnalysisResult, submitAnalysis, cancelAnalysis, type AnalysisResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import StockPriceChart from "@/components/StockPriceChart";
import RevenueChart from "@/components/RevenueChart";
import PEChart from "@/components/PEChart";
import TechnicalChart from "@/components/TechnicalChart";

const STAGE_LABELS: Record<string, string> = {
  queued: "Queued for processing",
  fetching_data: "Fetching market data...",
  fundamental_analysis: "Running fundamental analysis...",
  technical_analysis: "Running technical analysis...",
  sentiment_analysis: "Running sentiment analysis...",
  synthesizing: "Synthesizing final report...",
  completed: "Analysis complete!",
  failed: "Analysis failed",
};

const STAGE_ESTIMATES: Record<string, string> = {
  queued: "~30 seconds",
  fetching_data: "~45 seconds",
  fundamental_analysis: "~60 seconds",
  technical_analysis: "~60 seconds",
  sentiment_analysis: "~45 seconds",
  synthesizing: "~30 seconds",
};

// Helper: format a citation URL into a readable label
function formatCitationLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    // SEC EDGAR patterns
    if (host.includes("sec.gov")) {
      const path = u.pathname;
      // Try to extract ticker and filing type
      const tickerMatch = path.match(/[A-Z]{1,5}/);
      const filingMatch = path.match(/10-K|10-Q|8-K|DEF 14A/);
      if (tickerMatch || filingMatch) {
        return `${tickerMatch?.[0] || "SEC"} ${filingMatch?.[0] || "Filing"} FY${new Date().getFullYear()}`;
      }
      return `SEC EDGAR Filing`;
    }
    if (host.includes("finnhub")) return `Finnhub Market Data`;
    if (host.includes("fred")) return `FRED Economic Data`;
    // Fallback: return a shortened domain-based label
    return host.split(".").slice(-2).join(".").replace(/\.com$|\.io$|\.org$/, "").toUpperCase() || host;
  } catch {
    return url.length > 40 ? url.substring(0, 40) + "..." : url;
  }
}

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("queued");
  const [status, setStatus] = useState<"pending" | "running" | "completed" | "failed">("pending");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [estimatedRemaining, setEstimatedRemaining] = useState<string>("");
  const [cancelling, setCancelling] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stageStartRef = useRef<number>(Date.now());

  const pollForResult = useCallback(async () => {
    const interval = setInterval(async () => {
      try {
        const data = await getAnalysisResult(taskId);
        setResult(data);
        setProgress(data.progress);
        setCurrentStage(data.current_stage);
        setStatus(data.status);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
          if (data.status === "completed") {
            toast.success("Analysis complete!");
          }
        }
      } catch (err: any) {
        setError(err.message);
        clearInterval(interval);
      }
    }, 2000);
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    startTimeRef.current = Date.now();

    // Show timeout warning after 5 minutes
    const timeoutTimer = setTimeout(() => {
      if (status !== "completed" && status !== "failed") {
        setShowTimeoutWarning(true);
      }
    }, 5 * 60 * 1000);

    // Try to connect via SSE
    let es: EventSource;
    try {
      es = createAnalysisEventSource(taskId);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.progress !== undefined) setProgress(data.progress);
          if (data.current_stage) {
            if (data.current_stage !== currentStage) {
              stageStartRef.current = Date.now();
            }
            setCurrentStage(data.current_stage);
          }
          if (data.status) setStatus(data.status);
          if (data.report) {
            setResult((prev) => (prev ? { ...prev, report: data.report } : null));
          }
        } catch {
          // ignore parse errors
        }
      };

      es.onerror = () => {
        // SSE connection closed or errored — fall back to polling
        es.close();
        pollForResult();
      };
    } catch {
      // SSE not available, fall back to polling
      pollForResult();
    }

    return () => {
      clearTimeout(timeoutTimer);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [taskId, pollForResult, status]);

  // Compute estimated remaining time based on current stage
  useEffect(() => {
    if (status === "completed" || status === "failed") {
      setEstimatedRemaining("");
      return;
    }

    const estimate = STAGE_ESTIMATES[currentStage];
    if (!estimate) {
      setEstimatedRemaining("");
      return;
    }

    // Parse the estimate string (e.g., "~60 seconds")
    const match = estimate.match(/~(\d+)/);
    if (!match) {
      setEstimatedRemaining(estimate);
      return;
    }

    const totalSec = parseInt(match[1], 10);
    const elapsedSec = (Date.now() - stageStartRef.current) / 1000;
    const remainingSec = Math.max(0, Math.round(totalSec - elapsedSec));

    if (remainingSec <= 0) {
      setEstimatedRemaining("~a few seconds");
    } else {
      setEstimatedRemaining(`~${remainingSec} seconds`);
    }

    // Update every 2 seconds
    const timer = setInterval(() => {
      const e = (Date.now() - stageStartRef.current) / 1000;
      const r = Math.max(0, Math.round(totalSec - e));
      if (r <= 0) {
        setEstimatedRemaining("~a few seconds");
      } else {
        setEstimatedRemaining(`~${r} seconds`);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentStage, status]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      // Re-submit the analysis
      const ticker = result?.report?.sections?.[0]?.title || "";
      const result_data = await submitAnalysis({
        ticker: ticker || "AAPL",
        analysis_type: "comprehensive",
      });
      toast.success("Retrying analysis...");
      router.push(`/analyze/${result_data.task_id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to retry");
    } finally {
      setRetrying(false);
    }
  };

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type);
    toast.success(type === "like" ? "Thanks for your feedback!" : "Thanks! We'll work on improving.");
  };

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-600">Completed</Badge>;
      case "running":
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-amber-600">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0a0a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Analysis Result
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-gray-400 text-sm font-mono">Task ID: {taskId}</p>
        </div>

        {/* Progress */}
        {status !== "completed" && status !== "failed" && (
          <Card className="bg-[#12122a] border-indigo-500/10 mb-8">
            <CardContent className="py-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm font-medium">
                    {STAGE_LABELS[currentStage] || currentStage}
                  </span>
                  <span className="text-indigo-400 text-sm font-mono">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1e1e3a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {estimatedRemaining && (
                <p className="text-indigo-400/80 text-xs mt-1">
                  {STAGE_LABELS[currentStage] || currentStage}: {estimatedRemaining} remaining
                </p>
              )}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="animate-spin w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full inline-block" />
                Analyzing... This typically takes about 3 minutes
              </div>

              {/* Cancel button */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelling}
                  onClick={async () => {
                    setCancelling(true);
                    try {
                      await cancelAnalysis(taskId);
                      toast.success("Analysis cancelled");
                      router.push("/analyze");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to cancel");
                      setCancelling(false);
                    }
                  }}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  {cancelling ? (
                    <>
                      <span className="animate-spin w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full inline-block mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Timeout warning */}
              {showTimeoutWarning && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-amber-300 text-sm">
                    ⏱ This analysis is taking longer than expected. The system may be experiencing high demand.
                    You can wait a bit longer or{" "}
                    <Link href="/analyze" className="underline underline-offset-2">
                      start a new analysis
                    </Link>
                    .
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {status === "failed" && (
          <Card className="bg-[#12122a] border-red-500/20 mb-8">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-400 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-red-400 font-medium mb-1">
                    Analysis Failed
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    {result?.error || error || "An unknown error occurred."}
                  </p>
                  <Button
                    onClick={handleRetry}
                    disabled={retrying}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                  >
                    {retrying ? "Retrying..." : "Retry Analysis"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report */}
        {result?.report && (
          <div className="space-y-6">
            {/* Generated on + Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Generated on{" "}
                {result.report.generated_at
                  ? new Date(result.report.generated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })
                  : new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-gray-300 hover:bg-indigo-500/10 text-xs font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  Export PDF
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-gray-300 hover:bg-indigo-500/10 text-xs font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>

            {/* Summary */}
            <Card className="bg-[#12122a] border-indigo-500/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {result.report.summary}
                </p>
              </CardContent>
            </Card>

            {/* Charts Section */}
            {(result.technicals || result.fundamentals) && (
              <div className="space-y-6">
                {/* Stock Price Chart */}
                {result.technicals?.price_history && (
                  <Card className="bg-[#12122a] border-indigo-500/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Price Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StockPriceChart data={result.technicals.price_history} />
                    </CardContent>
                  </Card>
                )}

                {/* Revenue & Profit Chart */}
                {result.fundamentals?.financials && (
                  <Card className="bg-[#12122a] border-indigo-500/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Financial Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RevenueChart data={result.fundamentals.financials} />
                    </CardContent>
                  </Card>
                )}

                {/* PE Ratio Chart */}
                {result.fundamentals?.pe_history && (
                  <Card className="bg-[#12122a] border-indigo-500/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Valuation (P/E Ratio)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PEChart
                        data={result.fundamentals.pe_history}
                        currentPE={result.fundamentals.current_pe}
                        pe5yAvg={result.fundamentals.pe_5y_avg}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Technical Indicators */}
                {(result.technicals?.rsi || result.technicals?.macd) && (
                  <Card className="bg-[#12122a] border-indigo-500/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Technical Indicators
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TechnicalChart
                        rsi={result.technicals?.rsi}
                        macd={result.technicals?.macd}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Sections */}
            {result.report.sections.map((section, index) => (
              <Card key={index} className="bg-[#12122a] border-indigo-500/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                  {section.citations && section.citations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-indigo-500/10">
                      <p className="text-xs text-gray-500 mb-2">Citations:</p>
                      <ul className="space-y-1">
                        {section.citations.map((citation, ci) => (
                          <li
                            key={ci}
                            className="text-xs"
                          >
                            <a
                              href={citation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                              title={citation}
                            >
                              {formatCitationLabel(citation)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Sources */}
            {result.report.sources.length > 0 && (
              <Card className="bg-[#12122a] border-indigo-500/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.report.sources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-2 break-all"
                        >
                          {source.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Feedback Buttons */}
            <Card className="bg-[#12122a] border-indigo-500/10">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-4">
                  <p className="text-gray-400 text-sm mr-2">Was this analysis helpful?</p>
                  <button
                    onClick={() => handleFeedback("like")}
                    disabled={feedback !== null}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === "like"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-[#1e1e3a] text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                    } disabled:opacity-60`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleFeedback("dislike")}
                    disabled={feedback !== null}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === "dislike"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-[#1e1e3a] text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    } disabled:opacity-60`}
                  >
                    <svg className="w-5 h-5 scale-y-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Investment Disclaimer */}
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <div className="text-sm text-amber-300/90 leading-relaxed">
                  <p className="font-medium mb-1">
                    ⚠️ This report does not constitute investment advice.
                  </p>
                  <p>
                    All investment decisions carry risk. Past performance does
                    not guarantee future results. AlphaSync is not a registered
                    investment adviser.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Link href="/analyze">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
                  New Analysis
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Initial loading state */}
        {!result && status === "pending" && (
          <Card className="bg-[#12122a] border-indigo-500/10">
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Connecting to analysis service...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
