import { createClient } from "./supabase/client";
import { toUserFriendlyError } from "./errors";

const API_URL = "https://api.alqedge.com/api/v1";

// 从 Supabase cookie (sb-<ref>-auth-token) 解析 access_token 的兜底函数。
// 该应用登录后 session 由服务端 middleware 写入 cookie (createServerClient),
// 而 client 端 getSession() 读 localStorage/memory, 可能取不到 → 需兜底读 cookie。
function readAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
  if (!m) return null;
  try {
    let raw = m[1];
    if (raw.startsWith("base64-")) raw = raw.slice(7);
    const data = JSON.parse(atob(raw));
    return typeof data.access_token === "string" ? data.access_token : null;
  } catch {
    return null;
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || readAccessTokenFromCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface AnalyzeRequest {
  ticker: string;
  analysis_type: "fundamental" | "technical" | "sentiment" | "comprehensive";
}

export interface AnalyzeResponse {
  task_id: string;
  status: string;
}

export interface AnalysisResult {
  task_id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  current_stage: string;
  report?: {
    summary: string;
    sections: AnalysisSection[];
    sources: Source[];
    generated_at: string;
  };
  technicals?: Technicals;
  fundamentals?: Fundamentals;
  error?: string;
}

// ── 后端 /reports/{report_id} 真实报告契约 (contracts.md §四) ──
// 终态报告由 4 个 Agent 的 Markdown 输出组成, 与旧 report.summary/sections 结构不同。
export interface ReportCitation {
  source: "SEC_10K" | "SEC_10Q" | "SEC_8K" | "Finnhub" | "FRED" | "Reddit";
  url: string;
  excerpt?: string | null;
  section?: string | null;
  filing_date?: string | null;
}

export interface AgentOutput {
  content: string;
  citations?: ReportCitation[];
  elapsed_ms?: number;
  model?: string;
}

export interface TechnicalIndicators {
  rsi_14?: number;
  ma_50?: number;
  ma_200?: number;
  macd_signal?: "bullish" | "bearish" | "neutral";
}

export interface ReportResponse {
  report_id: string;
  ticker: string;
  status: "done" | "partial" | "failed";
  created_at?: string | null;
  completed_at?: string | null;
  total_elapsed_ms?: number | null;
  cached: boolean;
  fundamentals: (AgentOutput & {}) | null;
  technical: (AgentOutput & { indicators?: TechnicalIndicators }) | null;
  sentiment:
    | (AgentOutput & {
        news_score?: number | null;
        reddit_mentions?: number | null;
        analyst_consensus?: string | null;
      })
    | null;
  leader_synthesis:
    | (AgentOutput & {
        agreements?: string[];
        contradictions?: string[];
      })
    | null;
  error?: { code?: number; message?: string; retryable?: boolean } | null;
}

export interface AnalysisSection {
  title: string;
  content: string;
  citations?: string[];
}

export interface PricePoint {
  date: string;
  close: number;
  ma50?: number;
  ma200?: number;
}

export interface FinancialYear {
  year: number;
  revenue: number;
  net_income: number;
}

export interface PEPoint {
  date: string;
  pe_ratio: number;
}

export interface RsiPoint {
  date: string;
  rsi: number;
}

export interface MacdPoint {
  date: string;
  dif: number;
  dea: number;
  histogram: number;
}

export interface Technicals {
  price_history: PricePoint[];
  rsi: RsiPoint[];
  macd: MacdPoint[];
}

export interface Fundamentals {
  financials: FinancialYear[];
  pe_history: PEPoint[];
  current_pe?: number;
  pe_5y_avg?: number;
}

export interface Source {
  name: string;
  url: string;
}

/**
 * Submit a new analysis task.
 */
export async function submitAnalysis(
  data: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(toUserFriendlyError(err.detail || `HTTP ${res.status}`));
  }

  return res.json();
}

/**
 * Get full terminal report from /reports/{report_id} (backend real contract).
 * 终态 (done/partial/failed) 返回 4 个 Agent 的完整 Markdown 输出。
 */
export async function getReport(taskId: string): Promise<ReportResponse> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/reports/${taskId}`, {
    headers: { ...authHeaders },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(toUserFriendlyError(err.detail || `HTTP ${res.status}`));
  }

  return res.json();
}

/**
 * Get analysis result (non-SSE).
 */
export async function getAnalysisResult(
  taskId: string
): Promise<AnalysisResult> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/analyze/${taskId}/result`, {
    headers: { ...authHeaders },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(toUserFriendlyError(err.detail || `HTTP ${res.status}`));
  }

  return res.json();
}

/**
 * EventSource-compatible handle returned by createAnalysisEventSource.
 * 实现改用 fetch + ReadableStream 读 SSE（而非原生 EventSource），
 * 因为原生 EventSource 无法携带 Authorization 请求头（JWT），
 * 会导致后端 /stream 端点因无凭证返回 401 且绕过 CORS → 浏览器报 "Failed to fetch"/CORS 拦截。
 */
export interface AnalysisEventSource {
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  close: () => void;
}

/**
 * Create an SSE stream for real-time progress updates, sending the JWT via fetch.
 * 返回与 EventSource 兼容的句柄（onmessage/onerror/close），消费方用法不变。
 */
export function createAnalysisEventSource(taskId: string): AnalysisEventSource {
  const controller = new AbortController();
  const handle: AnalysisEventSource = {
    onmessage: null,
    onerror: null,
    close: () => controller.abort(),
  };

  // 延迟到下一宏任务再发起请求，确保调用方先绑定 onmessage/onerror
  // （原生 EventSource 同步返回，这里用 setTimeout(0) 模拟同步语义，避免丢事件）。
  setTimeout(async () => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_URL}/analyze/${taskId}/stream`, {
        headers: { Accept: "text/event-stream", ...authHeaders },
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        handle.onerror?.(new Event("error"));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // 按空行切分 SSE 事件。后端 (sse-starlette) 用 CRLF(\r\n) 分隔,
        // 兼容 \r\n\r\n 与 \n\n 两种空行。取 data: 行拼成 message.data。
        buffer = buffer.replace(/\r\n/g, "\n");
        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const dataLines = chunk.split("\n").filter((l) => l.startsWith("data:"));
          const data = dataLines.map((l) => l.slice(5).trim()).join("\n");
          if (data) {
            handle.onmessage?.(new MessageEvent("message", { data }));
          }
        }
      }
    } catch (err) {
      // abort 触发的取消不视为错误（与 EventSource.close() 语义一致）
      if (!controller.signal.aborted) {
        handle.onerror?.(new Event("error"));
      }
    }
  }, 0);

  return handle;
}

/**
 * Cancel an analysis task.
 */
export async function cancelAnalysis(taskId: string): Promise<{ status: string }> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/analyze/${taskId}/cancel`, {
    method: "POST",
    headers: { ...authHeaders },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Health check.
 */
export async function healthCheck(): Promise<{ status: string }> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/health`, {
    headers: { ...authHeaders },
  });
  return res.json();
}
