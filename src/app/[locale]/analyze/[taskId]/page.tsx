"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  createAnalysisEventSource,
  getReport,
  cancelAnalysis,
  type ReportResponse,
  type ReportCitation,
  type AnalysisEventSource,
} from "@/lib/api";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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

// 后端终态 status → 前端 status 映射
// 后端契约: queued|running|partial|done|failed (contracts.md §三)
// 前端渲染只认 pending|running|completed|failed, 需归一化。
function normalizeStatus(s: string | undefined): "pending" | "running" | "completed" | "failed" {
  switch (s) {
    case "done":
    case "partial":
      return "completed";
    case "failed":
    case "failed_retryable":
      return "failed";
    case "running":
      return "running";
    case "queued":
    case undefined:
      return "pending";
    default:
      return "pending";
  }
}

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

function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    SEC_10K: "SEC 10-K",
    SEC_10Q: "SEC 10-Q",
    SEC_8K: "SEC 8-K",
    Finnhub: "Finnhub",
    FRED: "FRED",
    Reddit: "Reddit",
  };
  return map[source] || source;
}

function CitationList({ citations }: { citations?: ReportCitation[] | null }) {
  if (!citations || citations.length === 0) return null;
  return (
    <div className="mt-4 pt-4 border-t border-indigo-500/10">
      <p className="text-xs text-gray-500 mb-2">Citations:</p>
      <ul className="space-y-1.5">
        {citations.map((citation, ci) => (
          <li key={ci} className="text-xs">
            <span className="text-gray-500 mr-1.5">{sourceLabel(citation.source)}</span>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all"
              title={citation.url}
            >
              {formatCitationLabel(citation.url)}
            </a>
            {citation.excerpt && (
              <p className="text-gray-500 mt-0.5 italic line-clamp-2">{citation.excerpt}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IndicatorBadges({ indicators }: { indicators?: { rsi_14?: number; ma_50?: number; ma_200?: number; macd_signal?: string } | null }) {
  if (!indicators) return null;
  const macdColor =
    indicators.macd_signal === "bullish"
      ? "text-emerald-400 border-emerald-500/30"
      : indicators.macd_signal === "bearish"
      ? "text-red-400 border-red-500/30"
      : "text-gray-300 border-gray-500/30";
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {indicators.rsi_14 !== undefined && (
        <span className="px-2.5 py-1 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-xs text-gray-300">
          RSI(14): <span className="text-indigo-300 font-mono">{indicators.rsi_14}</span>
        </span>
      )}
      {indicators.ma_50 !== undefined && (
        <span className="px-2.5 py-1 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-xs text-gray-300">
          MA(50): <span className="text-indigo-300 font-mono">{indicators.ma_50}</span>
        </span>
      )}
      {indicators.ma_200 !== undefined && (
        <span className="px-2.5 py-1 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-xs text-gray-300">
          MA(200): <span className="text-indigo-300 font-mono">{indicators.ma_200}</span>
        </span>
      )}
      {indicators.macd_signal && (
        <span className={`px-2.5 py-1 rounded-md bg-[#1e1e3a] border text-xs uppercase font-medium ${macdColor}`}>
          MACD: {indicators.macd_signal}
        </span>
      )}
    </div>
  );
}

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const taskId = params.taskId as string;

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("queued");
  const [status, setStatus] = useState<"pending" | "running" | "completed" | "failed">("pending");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [estimatedRemaining, setEstimatedRemaining] = useState<string>("");
  const [cancelling, setCancelling] = useState(false);
  const eventSourceRef = useRef<AnalysisEventSource | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stageStartRef = useRef<number>(Date.now());
  const fetchedReportRef = useRef(false);

  // 终态时拉取完整报告（/reports/{taskId}）
  const fetchReport = useCallback(async () => {
    if (fetchedReportRef.current) return;
    fetchedReportRef.current = true;
    try {
      const data = await getReport(taskId);
      setReport(data);
      // 报告 status 终态 → 归一化前端状态
      setStatus(normalizeStatus(data.status));
    } catch (err: any) {
      // 拉取失败不致命: 保留 progress/status, 报告区展示错误提示
      setError(err.message || "Failed to load report");
      setStatus("failed");
    }
  }, [taskId]);

  // 轮询兜底（SSE 不可用/断开时）
  const pollForResult = useCallback(async () => {
    const interval = setInterval(async () => {
      try {
        // 轮询用 /reports/{id} 也能拿到终态 + 报告；非终态会 400。
        // 这里用轻量做法：直接尝试 getReport，成功即终态。
        if (fetchedReportRef.current) {
          clearInterval(interval);
          return;
        }
        const data = await getReport(taskId);
        fetchedReportRef.current = true;
        setReport(data);
        setStatus(normalizeStatus(data.status));
        clearInterval(interval);
      } catch {
        // 非终态(400)或网络问题 → 继续轮询
      }
    }, 3000);
    return interval;
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    startTimeRef.current = Date.now();
    fetchedReportRef.current = false;

    // Show timeout warning after 5 minutes
    const timeoutTimer = setTimeout(() => {
      if (status !== "completed" && status !== "failed") {
        setShowTimeoutWarning(true);
      }
    }, 5 * 60 * 1000);

    // Try to connect via SSE
    let es: AnalysisEventSource;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    const stopFallback = () => {
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
        fallbackInterval = null;
      }
    };

    try {
      es = createAnalysisEventSource(taskId);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // progress / current_stage 更新
          if (data.progress !== undefined) setProgress(data.progress);
          if (data.current_stage) {
            if (data.current_stage !== currentStage) {
              stageStartRef.current = Date.now();
            }
            setCurrentStage(data.current_stage);
          }
          // 终态归一化 + 拉取完整报告
          const s = normalizeStatus(data.status);
          if (data.status) {
            setStatus(s);
            if (s === "completed" || s === "failed") {
              stopFallback();
              fetchReport();
            }
          }
        } catch {
          // ignore parse errors
        }
      };

      es.onerror = () => {
        // SSE 连接关闭/出错 → 用轮询兜底（终态时能拿到报告）
        es.close();
        stopFallback();
        pollForResult().then((interval) => {
          fallbackInterval = interval;
        });
      };
    } catch {
      // SSE 不可用 → 轮询兜底
      pollForResult().then((interval) => {
        fallbackInterval = interval;
      });
    }

    return () => {
      clearTimeout(timeoutTimer);
      stopFallback();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [taskId, pollForResult, fetchReport, status]);

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

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-600">{t("analysisResult.status.completed")}</Badge>;
      case "running":
        return <Badge className="bg-blue-600">{t("analysisResult.status.inProgress")}</Badge>;
      case "pending":
        return <Badge className="bg-amber-600">{t("analysisResult.status.pending")}</Badge>;
      case "failed":
        return <Badge className="bg-red-600">{t("analysisResult.status.failed")}</Badge>;
    }
  };

  const renderMarkdown = (content?: string | null) => {
    if (!content) return null;
    return <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</div>;
  };

  // 报告是否可渲染（终态 + 至少一个 Agent 输出）
  const hasReport = report && (report.leader_synthesis || report.fundamentals || report.technical || report.sentiment);

  const agentCards = report
    ? [
        {
          key: "fundamentals",
          title: "Fundamental Analysis",
          data: report.fundamentals,
          extra: null,
        },
        {
          key: "technical",
          title: "Technical Analysis",
          data: report.technical,
          extra: report.technical ? <IndicatorBadges indicators={report.technical.indicators} /> : null,
        },
        {
          key: "sentiment",
          title: "Sentiment Analysis",
          data: report.sentiment,
          extra: report.sentiment ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {report.sentiment.news_score !== undefined && report.sentiment.news_score !== null && (
                <span className="px-2.5 py-1 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-xs text-gray-300">
                  News Score: <span className="text-indigo-300 font-mono">{report.sentiment.news_score}</span>
                </span>
              )}
              {report.sentiment.reddit_mentions !== undefined && report.sentiment.reddit_mentions !== null && (
                <span className="px-2.5 py-1 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-xs text-gray-300">
                  Reddit Mentions: <span className="text-indigo-300 font-mono">{report.sentiment.reddit_mentions}</span>
                </span>
              )}
              {report.sentiment.analyst_consensus && (
                <span className="px-2.5 py-1 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-xs text-gray-300">
                  Analyst Consensus: <span className="text-indigo-300">{report.sentiment.analyst_consensus}</span>
                </span>
              )}
            </div>
          ) : null,
        },
      ]
    : [];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0a0a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {report?.ticker ? `${report.ticker} — ${t("analysisResult.title")}` : t("analysisResult.title")}
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-gray-400 text-sm font-mono">{t("analysisResult.taskId", { id: taskId })}</p>
          {report?.completed_at && (
            <p className="text-xs text-gray-500 mt-1">
              {t("analysisResult.generatedOn", {
                date: new Date(report.completed_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                }),
              })}
            </p>
          )}
        </div>

        {/* Progress */}
        {status !== "completed" && status !== "failed" && (
          <Card className="bg-[#12122a] border-indigo-500/10 mb-8">
            <CardContent className="py-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm font-medium">
                    {t(`analysisResult.stages.${currentStage}`) || currentStage}
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
                  {t(`analysisResult.stages.${currentStage}`) || currentStage}: {estimatedRemaining} remaining
                </p>
              )}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="animate-spin w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full inline-block" />
                {t("analysisResult.progress.analyzing")}
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
                      {t("analysisResult.progress.cancelling")}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t("analysisResult.progress.cancel")}
                    </>
                  )}
                </Button>
              </div>

              {/* Timeout warning */}
              {showTimeoutWarning && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-amber-300 text-sm">
                    <>{t("analysisResult.progress.timeoutWarning")} <Link href="/analyze" className="underline underline-offset-2">{t("analysisResult.progress.startNew")}</Link>.</>
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
                    {t("analysisResult.error.title")}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    {error || report?.error?.message || "An unknown error occurred."}
                  </p>
                  <Button
                    onClick={() => router.push("/analyze")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                  >
                    {t("analysisResult.actions.newAnalysis")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report */}
        {hasReport && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                {report?.total_elapsed_ms
                  ? `Completed in ${(report.total_elapsed_ms / 1000).toFixed(0)}s`
                  : ""}
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
                  {t("analysisResult.actions.exportPDF")}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success(t("analysisResult.actions.linkCopied"));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e1e3a] border border-indigo-500/20 text-gray-300 hover:bg-indigo-500/10 text-xs font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  {t("analysisResult.actions.copyLink")}
                </button>
              </div>
            </div>

            {/* Leader Synthesis (综合结论) */}
            {report.leader_synthesis && (
              <Card className="bg-[#12122a] border-indigo-500/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderMarkdown(report.leader_synthesis.content)}
                  {(report.leader_synthesis.agreements && report.leader_synthesis.agreements.length > 0) ||
                    (report.leader_synthesis.contradictions && report.leader_synthesis.contradictions.length > 0) ? (
                    <>
                      <Separator className="bg-indigo-500/10" />
                      {report.leader_synthesis.agreements && report.leader_synthesis.agreements.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-400 font-medium mb-2">Key Agreements</p>
                          <ul className="space-y-1.5">
                            {report.leader_synthesis.agreements.map((a, i) => (
                              <li key={i} className="text-sm text-gray-300 flex gap-2">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {report.leader_synthesis.contradictions && report.leader_synthesis.contradictions.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-400 font-medium mb-2">Key Contradictions</p>
                          <ul className="space-y-1.5">
                            {report.leader_synthesis.contradictions.map((c, i) => (
                              <li key={i} className="text-sm text-gray-300 flex gap-2">
                                <span className="text-amber-400 mt-0.5">⚠</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Agent Cards */}
            {agentCards.map(
              (agent) =>
                agent.data && (
                  <Card key={agent.key} className="bg-[#12122a] border-indigo-500/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{agent.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderMarkdown(agent.data.content)}
                      {agent.extra}
                      <CitationList citations={agent.data.citations} />
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        )}

        {/* Initial loading state */}
        {!hasReport && status === "pending" && (
          <Card className="bg-[#12122a] border-indigo-500/10">
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">{t("analysisResult.connecting")}</p>
            </CardContent>
          </Card>
        )}

        {/* 终态但报告为空(非failed) → 提示 */}
        {!hasReport && status === "completed" && (
          <Card className="bg-[#12122a] border-indigo-500/10">
            <CardContent className="py-8 text-center">
              <p className="text-gray-400 text-sm">Analysis completed, but no report content is available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
