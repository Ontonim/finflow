import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { formatDateShort, CATEGORY_COLORS } from "@/lib/utils";
import { IBlog } from "@/models/Blog";

interface BlogCardProps {
  blog: Pick<
    IBlog,
    | "_id"
    | "title"
    | "slug"
    | "excerpt"
    | "category"
    | "featuredImage"
    | "readingTime"
    | "createdAt"
    | "sourcePublisher"
  >;
  variant?: "default" | "hero" | "compact";
}

export default function BlogCard({ blog, variant = "default" }: BlogCardProps) {
  const categoryColor =
    CATEGORY_COLORS[blog.category] || "bg-slate-100 text-slate-600";

  if (variant === "hero") {
    return (
      <Link href={`/blog/${blog.slug}`} className="group block">
        <article className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[420px] flex flex-col justify-end card-hover">
          {blog.featuredImage ? (
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950" />
          )}
          <div className="relative p-8 md:p-10">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${categoryColor}`}
            >
              {blog.category}
            </span>
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-emerald-300 transition-colors"
            >
              {blog.title}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-5 max-w-2xl line-clamp-2">
              {blog.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{blog.sourcePublisher}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} min read
              </span>
              <span>·</span>
              <span>{formatDateShort(blog.createdAt)}</span>
            </div>
            <div className="mt-5 inline-flex items-center gap-1 text-emerald-400 text-sm font-semibold group-hover:gap-2 transition-all">
              Read Article <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/blog/${blog.slug}`} className="group flex gap-3">
        <article className="flex gap-3 w-full">
          <div className="flex-1 min-w-0">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${categoryColor}`}
            >
              {blog.category}
            </span>
            <h3 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {formatDateShort(blog.createdAt)} · {blog.readingTime} min
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/blog/${blog.slug}`} className="group block h-full">
      <article className="h-full bg-white rounded-xl border border-slate-100 overflow-hidden card-hover flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
          {blog.featuredImage ? (
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-400"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center">
              <span className="text-4xl opacity-20">📈</span>
            </div>
          )}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor}`}
          >
            {blog.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors"
          >
            {blog.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
            {blog.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{blog.readingTime} min read</span>
              <span>·</span>
              <span>{formatDateShort(blog.createdAt)}</span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold group-hover:underline">
              Read →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
