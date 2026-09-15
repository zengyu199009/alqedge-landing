import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

// 博客列表页：静态渲染，展示所有文章
export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <div className="border-b border-indigo-500/10 bg-gradient-to-b from-[#0f0f2e] to-[#0a0a1a]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            AlphaSync Blog
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Insights on <span className="text-gradient">AI-Powered</span> Stock
            Analysis
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            How AlphaSync reads SEC filings, what to check before earnings, and
            how institutional-grade research is becoming accessible to every
            investor.
          </p>
        </div>
      </div>

      {/* Posts list */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group p-6 md:p-8 rounded-2xl bg-[#12122a] border border-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="flex items-center gap-3 mb-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  {post.category}
                </span>
                <span className="text-gray-500">{post.date}</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-500">{post.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3">
                {post.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
              <div className="mt-4 text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                Read more →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
