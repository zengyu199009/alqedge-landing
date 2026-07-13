import { createClient } from "./supabase/client";
import { toUserFriendlyError } from "./errors";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
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
 * Create an SSE EventSource for real-time progress updates.
 */
export function createAnalysisEventSource(taskId: string): EventSource {
  return new EventSource(`${API_URL}/analyze/${taskId}/stream`);
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
