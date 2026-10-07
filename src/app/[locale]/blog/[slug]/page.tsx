import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { locales } from "@/navigation";

// 文章详情页：静态渲染（generateStaticParams 预生成所有文章）
// 注意：需返回完整动态段参数（locale + slug），否则 Next.js 15 会 404/500
export function generateStaticParams() {
  return getAllPosts().flatMap((post) =>
    locales.map((locale) => ({ locale, slug: post.slug }))
  );
}

// 每篇文章独立 SEO：标题含关键词 + canonical + OG
// 覆盖根 layout 的全局默认 metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const canonical = `https://alqedge.com/${locale}/blog/${post.slug}`;
  return {
    title: `${post.title} — AlphaSync Blog`,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: canonical,
      siteName: "AlphaSync",
    },
  };
}

// 渲染单个内容块：兼容旧格式（string，## 开头=H2）与新格式（{type,text|html}）
function renderBlock(block: string | { type: string; text?: string; html?: string }, i: number) {
  if (typeof block === "string") {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
          {block.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i} className="text-gray-300 leading-relaxed text-lg mb-6">
        {block}
      </p>
    );
  }
  // 新格式
  if (block.type === "h2") {
    return (
      <div key={i} className="blog-body">
        <h2>{block.text}</h2>
      </div>
    );
  }
  if (block.type === "h3") {
    return (
      <div key={i} className="blog-body">
        <h3>{block.text}</h3>
      </div>
    );
  }
  // html 块：dangerouslySetInnerHTML 渲染（稿件为静态可信内容）
  return (
    <div
      key={i}
      className="blog-body"
      dangerouslySetInnerHTML={{ __html: block.html || "" }}
    />
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonical = `https://alqedge.com/${locale}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "AlphaSync" },
    publisher: { "@type": "Organization", name: "AlphaSync", url: "https://alqedge.com/" },
    url: canonical,
    mainEntityOfPage: canonical,
    description: post.excerpt,
  };

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      {/* JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Header */}
      <div className="border-b border-indigo-500/10 bg-gradient-to-b from-[#0f0f2e] to-[#0a0a1a]">
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-16">
          <Link
            href={`/${locale}/blog`}
            className="inline-block text-indigo-400 hover:text-indigo-300 text-sm mb-6 transition-colors"
          >
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              {post.category}
            </span>
            <span className="text-gray-500">{post.date}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-10">
        <div className="max-w-none">
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-[#12122a] border border-indigo-500/10">
          <h3 className="text-lg font-bold text-white mb-2">
            Analyze any US stock in minutes
          </h3>
          <p className="text-gray-400 mb-4">
            Get a structured research report with SEC-sourced citations from
            AlphaSync&apos;s three AI analysts.
          </p>
          <Link
            href={`/${locale}/analyze`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Start Free Analysis
          </Link>
        </div>
      </article>
    </main>
  );
}
