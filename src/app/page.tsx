import { Suspense } from "react";
import connectDB from "@/lib/mongodb";
import Blog, { IBlog } from "@/models/Blog";
import BlogCard from "@/components/blog/BlogCard";
import AdBanner from "@/components/ads/AdBanner";
import { SkeletonCard, SkeletonHero } from "@/components/ui/SkeletonCard";
import { CATEGORIES } from "@/lib/utils";
import Link from "next/link";
import AnchorAd from "@/components/ads/AnchorAd";

async function getHomeBlogs() {
  await connectDB();
  const blogs = await Blog.find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(13)
    .lean();
  return JSON.parse(JSON.stringify(blogs)) as IBlog[];
}

export default async function HomePage() {
  const blogs = await getHomeBlogs();
  const [hero, ...rest] = blogs;

  return (
    <div className="min-h-screen">
      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner
          slot="TOP_BANNER_SLOT_ID"
          format="fluid"
          label="Advertisement"
          style={{ minHeight: 90, width: "100%" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-2"
          >
            Finance News & Insights
          </h1>
          <p className="text-slate-500 text-lg">
            AI-curated market analysis, investing guides, and financial news for Tier-1 investors.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "All" ? "/" : `/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                cat === "All"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Hero post */}
        {hero ? (
          <div className="mb-10">
            <Suspense fallback={<SkeletonHero />}>
              <BlogCard blog={hero} variant="hero" />
            </Suspense>
          </div>
        ) : (
          <div className="mb-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-[420px] flex items-center justify-center">
            <div className="text-center text-slate-400">
              <p className="text-4xl mb-3">📰</p>
              <p className="text-sm font-medium">No articles yet.</p>
              <p className="text-xs mt-1">
                Run the{" "}
                <a href="/admin" className="text-emerald-600 underline">
                  automation cron
                </a>{" "}
                to fetch and generate your first posts.
              </p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {rest.length > 0 ? (
          <>
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl font-bold text-slate-900 mb-6"
            >
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((blog) => (
                <Suspense key={String(blog._id)} fallback={<SkeletonCard />}>
                  <BlogCard blog={blog} />
                </Suspense>
              ))}
            </div>
          </>
        ) : (
          blogs.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )
        )}

        {/* Bottom CTA */}
        {rest.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/category/markets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              View All Articles →
            </Link>
          </div>
        )}
      </div>

      {/* Mobile anchor ad */}
      <AnchorAd />
    </div>
  );
}
