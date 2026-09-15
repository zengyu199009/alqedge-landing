// blog.ts — 博客文章数据源（静态内容，无需后台/数据库）
// 文章贴合 AlphaSync 美股 AI 分析产品定位，主题围绕 AI 投资分析、SEC 数据、美股研究

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO 格式，如 2026-09-15
  excerpt: string;
  category: string;
  readTime: string; // 阅读时长，如 "5 min read"
  content: string[]; // 段落数组，支持简单 markdown 式标题（## 开头）
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-ai-analysts-read-sec-filings",
    title: "How AI Analysts Read SEC Filings: A Look Inside AlphaSync's Pipeline",
    date: "2026-09-15",
    excerpt:
      "SEC filings are the rawest source of truth about a public company. Here's how AlphaSync's three AI analysts turn 10-Ks, 10-Qs, and 8-Ks into structured, cited research in minutes.",
    category: "Product",
    readTime: "6 min read",
    content: [
      "Public markets run on information, but most of it is buried in documents that are dense, legalistic, and thousands of pages long. The 10-K alone — a company's annual report — routinely exceeds 100 pages of financial statements, risk factors, and management discussion.",
      "## The data problem",
      "A single retail investor reading one 10-K cover-to-cover would spend hours, and that's before cross-referencing quarterly reports, insider filings, and press releases. Multiply that across a watchlist of 20 tickers and the task becomes impossible.",
      "This is exactly the problem AlphaSync was built to solve. Instead of summarizing headlines, our pipeline starts at the source: the SEC EDGAR database.",
      "## How the pipeline works",
      "When you submit a ticker, AlphaSync dispatches three AI analysts in parallel. The fundamental analyst pulls the latest 10-K, 10-Q, and 8-K filings from SEC EDGAR, then extracts revenue, margins, cash flow, and segment data into a normalized structure.",
      "The technical analyst takes over price history and trading volumes, computing trend, momentum, and volatility indicators against a 15-minute delayed quote feed.",
      "Meanwhile, the sentiment analyst scans news and social signals, filtering for noise and weighting sources by credibility.",
      "A lead analyst then synthesizes all three streams into a single research report — and every claim links back to a specific filing or data point, so you can verify the reasoning yourself.",
      "## Why citations matter",
      "AI-generated analysis is only as trustworthy as its sources. By anchoring every claim to SEC filings, AlphaSync lets you trace the pipeline's logic end-to-end. No black boxes, no vibes — just verifiable research.",
      "Try it yourself: enter any US ticker on the Analyze page and get a structured report in about three minutes."
    ],
  },
  {
    slug: "three-metrics-that-matter-before-earnings",
    title: "3 Metrics to Check Before Every Earnings Call",
    date: "2026-09-10",
    excerpt:
      "Before you listen to another earnings call, spend five minutes on these three data points. They'll tell you more about a company's trajectory than the call itself.",
    category: "Education",
    readTime: "4 min read",
    content: [
      "Earnings season is where stock narratives are made and broken. But by the time the CEO starts talking about 'record quarters' and 'strong demand', the market has already priced in most of the information.",
      "The edge doesn't come from listening harder — it comes from knowing what to check before the call begins.",
      "## 1. Free cash flow, not just EPS",
      "Earnings per share can be flattered by buybacks, one-time gains, and accounting choices. Free cash flow is harder to game. If a company reports growing EPS while free cash flow shrinks, the quality of those earnings deserves scrutiny.",
      "## 2. Guidance vs. consensus",
      "The single biggest catalyst in an earnings announcement is not the past quarter — it's the forward guidance. Compare management's revenue or EPS guidance against the analyst consensus. A small miss on the past quarter is forgotten; a warning about the future moves the stock.",
      "## 3. Insider behavior",
      "Filings like Form 4 (insider transactions) show whether executives are buying or selling their own stock. Sustained insider selling ahead of an earnings date is a yellow flag worth investigating. Sustained buying? Often a quiet signal of confidence.",
      "## Put it all together with AlphaSync",
      "Each of these metrics is pulled automatically by AlphaSync's fundamental analyst — free cash flow from the cash flow statement, consensus estimates from aggregated market data, and insider activity from SEC Form 4 filings.",
      "Run a comprehensive analysis before your next earnings call and let the three analysts do the homework."
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
