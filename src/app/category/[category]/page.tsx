import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Blog, { IBlog } from "@/models/Blog";
import BlogCard from "@/components/blog/BlogCard";
import AdBanner from "@/components/ads/AdBanner";
import AnchorAd from "@/components/ads/AnchorAd";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_DISPLAY: Record<string, string> = {
  markets: "Markets",
  investing: "Investing",
  insurance: "Insurance",
  loans: "Loans",
  crypto: "Crypto",
  economy: "Economy",
  "personal-finance": "Personal Finance",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const display = CATEGORY_DISPLAY[category];
  if (!display) return { title: "Category Not Found" };

  return {
    title: `${display} News & Analysis`,
    description: `Latest AI-curated ${display.toLowerCase()} news, analysis, and insights for investors and professionals.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const display = CATEGORY_DISPLAY[category];
  if (!display) notFound();

  await connectDB();
  const blogs = await Blog.find({ status: "published", category: display })
    .sort({ createdAt: -1 })
    .limit(18)
    .lean();
  const posts = JSON.parse(JSON.stringify(blogs)) as IBlog[];

  const [hero, ...rest] = posts;
  const categoryColor = CATEGORY_COLORS[display] || "bg-slate-100 text-slate-600";

  return (
    <div className="min-h-screen">
      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner
          slot="TOP_BANNER_SLOT_ID"
          format="fluid"
          style={{ minHeight: 90, width: "100%" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColor}`}>
            {display}
          </span>
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-2"
          >
            {display} News
          </h1>
          <p className="text-slate-500 text-lg">
            Latest AI-curated {display.toLowerCase()} analysis and articles.
          </p>
        </div>

        {/* Category Nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-sm font-medium border bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700 transition-all"
          >
            All
          </Link>
          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                cat === display
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Hero */}
        {hero && (
          <div className="mb-10">
            <BlogCard blog={hero} variant="hero" />
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((blog) => (
              <BlogCard key={String(blog._id)} blog={blog} />
            ))}
          </div>
        ) : (
          posts.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <p className="text-4xl mb-3">📰</p>
              <p className="font-medium">No {display} articles yet.</p>
              <p className="text-sm mt-1">Check back soon or run the content automation.</p>
            </div>
          )
        )}
      </div>
      <AnchorAd />
    </div>
  );
}
