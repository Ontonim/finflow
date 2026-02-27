import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import { toggleBlogStatus, deleteBlog } from "@/actions/blog.actions";
import { toggleCommentApproval, deleteComment } from "@/actions/comment.actions";
import { formatDateShort, CATEGORY_COLORS } from "@/lib/utils";
import { TrendingUp, FileText, MessageSquare, CheckCircle, XCircle, RefreshCw, Eye, Trash2, ToggleLeft, ToggleRight, Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — FinFlow AI",
  robots: { index: false, follow: false },
};

async function getStats() {
  await connectDB();
  const [totalBlogs, publishedBlogs, draftBlogs, totalComments, pendingComments] =
    await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      Comment.countDocuments(),
      Comment.countDocuments({ isApproved: false }),
    ]);
  return { totalBlogs, publishedBlogs, draftBlogs, totalComments, pendingComments };
}

async function getRecentBlogs() {
  const blogs = await Blog.find().sort({ createdAt: -1 }).limit(20).lean();
  return JSON.parse(JSON.stringify(blogs));
}

async function getPendingComments() {
  const comments = await Comment.find({ isApproved: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("blogId", "title slug")
    .lean();
  return JSON.parse(JSON.stringify(comments));
}

export default async function AdminPage() {
  const [stats, blogs, pendingComments] = await Promise.all([
    getStats(),
    getRecentBlogs(),
    getPendingComments(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base sm:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                FinFlow AI — Admin
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Content Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Article</span>
              <span className="xs:hidden">New</span>
            </Link>
            <Link href="/" className="text-xs sm:text-sm text-slate-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
              ← Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: "Total Articles", value: stats.totalBlogs, icon: FileText, color: "text-slate-700" },
            { label: "Published", value: stats.publishedBlogs, icon: CheckCircle, color: "text-emerald-600" },
            { label: "Drafts", value: stats.draftBlogs, icon: XCircle, color: "text-amber-500" },
            { label: "Comments", value: stats.totalComments, icon: MessageSquare, color: "text-blue-600" },
            { label: "Pending Review", value: stats.pendingComments, icon: RefreshCw, color: "text-rose-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className={`${color} mb-1`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Article Management */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-slate-900">
              Articles
            </h2>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write Article
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {blogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium mb-1">No articles yet</p>
                <p className="text-slate-400 text-sm mb-4">Click "New Article" to write your first post.</p>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Write First Article
                </Link>
              </div>
            ) : (
              blogs.map((blog: {
                _id: string;
                title: string;
                slug: string;
                status: string;
                category: string;
                views: number;
                createdAt: string;
                sourcePublisher: string;
              }) => (
                <div key={blog._id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[blog.category] || "bg-slate-100 text-slate-600"}`}>
                        {blog.category}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${blog.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {blog.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 sm:line-clamp-1">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-emerald-600 transition-colors" target="_blank">
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDateShort(blog.createdAt)} · {blog.views} views
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* View */}
                    <Link href={`/blog/${blog.slug}`} target="_blank"
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </Link>
                    {/* Edit */}
                    <Link href={`/admin/posts/${blog._id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    {/* Toggle status */}
                    <form action={async () => { "use server"; await toggleBlogStatus(blog._id); }}>
                      <button type="submit"
                        className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        title={blog.status === "published" ? "Set to draft" : "Publish"}>
                        {blog.status === "published" ? (
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                    </form>
                    {/* Delete */}
                    <form action={async () => { "use server"; await deleteBlog(blog._id); }}>
                      <button type="submit"
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Comments */}
        {pendingComments.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-slate-900">
                Pending Comments
              </h2>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">
                {pendingComments.length} waiting
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {pendingComments.map((comment: {
                _id: string;
                name: string;
                content: string;
                createdAt: string;
                blogId: { title: string; slug: string } | null;
              }) => (
                <div key={comment._id} className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 mb-0.5">
                        {comment.name}
                        {comment.blogId && (
                          <span className="font-normal text-slate-400">
                            {" "}on{" "}
                            <Link href={`/blog/${comment.blogId.slug}`} target="_blank" className="text-emerald-600 hover:underline">
                              {comment.blogId.title.slice(0, 40)}…
                            </Link>
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-700 line-clamp-2 mt-1">{comment.content}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDateShort(comment.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <form action={async () => { "use server"; await toggleCommentApproval(comment._id); }}>
                        <button type="submit"
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"><CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      </form>
                      <form action={async () => { "use server"; await deleteComment(comment._id); }}>
                        <button type="submit"
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
