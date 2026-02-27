import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Blog, { IBlog } from "@/models/Blog";
import Comment from "@/models/Comment";
import ContentRenderer from "@/components/blog/ContentRenderer";
import SocialShare from "@/components/blog/SocialShare";
import Sidebar from "@/components/sidebar/Sidebar";
import CommentForm from "@/components/blog/CommentForm";
import CommentList from "@/components/blog/CommentList";
import AdBanner from "@/components/ads/AdBanner";
import AnchorAd from "@/components/ads/AnchorAd";
import { formatDate, CATEGORY_COLORS } from "@/lib/utils";
import { Clock, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { incrementViews } from "@/actions/blog.actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogData(slug: string) {
  await connectDB();
  const blog = await Blog.findOne({ slug, status: "published" }).lean();
  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog)) as IBlog;
}

async function getComments(blogId: string) {
  const comments = await Comment.find({ blogId, isApproved: true })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(comments));
}

async function getRelated(category: string, currentSlug: string) {
  const related = await Blog.find({
    category,
    status: "published",
    slug: { $ne: currentSlug },
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
  return JSON.parse(JSON.stringify(related)) as IBlog[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug, status: "published" }).lean();
  if (!blog) return { title: "Article Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai";

  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    keywords: blog.tags,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDescription,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
      publishedTime: new Date(blog.createdAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle,
      description: blog.metaDescription,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) notFound();

  const [comments, relatedPosts] = await Promise.all([
    getComments(String(blog._id)),
    getRelated(blog.category, blog.slug),
  ]);

  // Increment views (non-blocking)
  incrementViews(String(blog._id)).catch(() => {});

  const categoryColor = CATEGORY_COLORS[blog.category] || "bg-slate-100 text-slate-600";

  return (
    <>
      {/* JSON-LD structured data */}
      {blog.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: blog.jsonLd }}
        />
      )}

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

        {/* Article Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
              {blog.category}
            </span>
          </div>
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4"
          >
            {blog.title}
          </h1>
          <p className="text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed mb-6">
            {blog.excerpt}
          </p>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>
                Source:{" "}
                <a
                  href={blog.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  {blog.sourcePublisher}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{blog.readingTime} min read</span>
            </div>
            <span>{formatDate(blog.createdAt)}</span>
            {blog.views > 0 && <span>{blog.views.toLocaleString()} views</span>}
          </div>
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs text-slate-500 bg-slate-100 border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8 mt-4">
            <div className="relative h-48 sm:h-64 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 3-Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Left: Social Share (desktop only) */}
            <div className="hidden lg:flex flex-col items-center pt-4 w-12 flex-shrink-0">
              <div className="sticky top-24">
                <SocialShare title={blog.title} slug={blog.slug} />
              </div>
            </div>

            {/* Center: Article */}
            <div className="flex-1 min-w-0">
              <ContentRenderer content={blog.content} />

              {/* Source attribution */}
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-500">
                <strong>Source: </strong>
                <a
                  href={blog.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  {blog.sourcePublisher} — original article
                </a>
                <p className="mt-1 text-xs text-slate-400">
                  This content is AI-rewritten for educational purposes. Always verify financial information before making investment decisions.
                </p>
              </div>

              {/* Mobile Social Share */}
              <div className="flex lg:hidden items-center justify-center gap-3 mt-6 sm:mt-8">
                <SocialShare title={blog.title} slug={blog.slug} />
              </div>

              {/* Comments */}
              <div className="mt-8 sm:mt-12">
                <h2
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6"
                >
                  Comments ({comments.length})
                </h2>
                <CommentList comments={comments} />
                <div className="mt-6 sm:mt-8">
                  <CommentForm blogId={String(blog._id)} />
                </div>
              </div>

              {/* Related posts on mobile */}
              {relatedPosts.length > 0 && (
                <div className="lg:hidden mt-8 sm:mt-12">
                  <h2
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-lg sm:text-xl font-bold text-slate-900 mb-4"
                  >
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {relatedPosts.slice(0, 2).map((post) => (
                      <Link
                        key={String(post._id)}
                        href={`/blog/${post.slug}`}
                        className="block p-3 sm:p-4 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors"
                      >
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-emerald-700">
                          {post.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar (desktop only) */}
            <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <Sidebar relatedPosts={relatedPosts} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile anchor ad */}
      <AnchorAd />
    </>
  );
}
