"use client";

import { useState } from "react";
import { submitComment } from "@/actions/comment.actions";
import { MessageCircle, Loader2 } from "lucide-react";

interface CommentFormProps {
  blogId: string;
}

export default function CommentForm({ blogId }: CommentFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    formData.set("blogId", blogId);

    const res = await submitComment(formData);
    setResult(res);
    setLoading(false);

    if (res.success) {
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <h3
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5 text-emerald-600" />
        Leave a Comment
      </h3>

      {result?.success ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
          ✅ {result.message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="blogId" value={blogId} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Smith"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email * <span className="text-slate-400 normal-case font-normal">(not published)</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Comment *
            </label>
            <textarea
              name="content"
              required
              rows={4}
              placeholder="Share your thoughts on this article..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
            />
          </div>

          {result?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
              ⚠️ {result.error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Submitting..." : "Post Comment"}
            </button>
            <p className="text-xs text-slate-400">
              Comments are moderated before appearing.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
