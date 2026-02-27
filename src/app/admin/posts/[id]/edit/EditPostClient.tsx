"use client";

import { useState, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { updatePost } from "@/actions/post.actions";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Image,
  Link,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { CATEGORIES } from "@/lib/utils";
import NextLink from "next/link";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  status: "published" | "draft";
}

export default function EditPostClient({ post }: { post: Post }) {
  const router = useRouter();
  const boundUpdatePost = updatePost.bind(null, post._id);
  const [state, formAction, isPending] = useActionState(boundUpdatePost, { success: false, error: null });

  const [content, setContent] = useState(post.content || "");
  const [imageUrl, setImageUrl] = useState(post.featuredImage || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"published" | "draft">(post.status || "draft");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (state.success) {
    router.push("/admin");
  }

  const insertAtCursor = (before: string, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertAtCursor("<strong>", "</strong>") },
    { icon: Italic, label: "Italic", action: () => insertAtCursor("<em>", "</em>") },
    { icon: Heading2, label: "H2", action: () => insertAtCursor("<h2>", "</h2>") },
    { icon: Heading3, label: "H3", action: () => insertAtCursor("<h3>", "</h3>") },
    { icon: List, label: "List", action: () => insertAtCursor("<ul>\n  <li>", "</li>\n</ul>") },
    { icon: Quote, label: "Blockquote", action: () => insertAtCursor("<blockquote>", "</blockquote>") },
    { icon: Link, label: "Link", action: () => insertAtCursor('<a href="URL">', "</a>") },
  ];

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setImageError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
      else setImageError(data.error || "Upload failed");
    } catch {
      setImageError("Upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NextLink href="/admin" className="text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft size={20} />
            </NextLink>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-slate-900 text-lg">
              Edit Article
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 transition-colors px-3 py-1.5 border border-slate-200 rounded-lg"
          >
            {preview ? <EyeOff size={15} /> : <Eye size={15} />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      <form action={formAction} className="max-w-6xl mx-auto px-4 py-8">
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="featuredImage" value={imageUrl} />
        <input type="hidden" name="status" value={submitStatus} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <input
                name="title"
                defaultValue={post.title}
                placeholder="Article Title..."
                required
                className="w-full text-2xl font-bold text-slate-900 border-none outline-none placeholder:text-slate-300"
                style={{ fontFamily: "'Playfair Display', serif" }}
              />
              <div className="h-px bg-slate-100 my-3" />
              <textarea
                name="excerpt"
                defaultValue={post.excerpt}
                placeholder="Short excerpt..."
                rows={2}
                required
                className="w-full text-sm text-slate-500 border-none outline-none resize-none placeholder:text-slate-300"
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50">
                {toolbarButtons.map(({ icon: Icon, label, action }) => (
                  <button key={label} type="button" onClick={action} title={label}
                    className="p-2 rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-800 transition-all">
                    <Icon size={15} />
                  </button>
                ))}
              </div>
              {preview ? (
                <div className="article-content p-6 min-h-[400px]" dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)}
                  className="w-full p-5 min-h-[400px] text-sm text-slate-700 border-none outline-none resize-y font-mono leading-relaxed" />
              )}
            </div>

            {state.error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">⚠️ {state.error}</div>
            )}
            {imageError && (
              <div className="text-amber-600 text-sm bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">⚠️ Image: {imageError}</div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm">Update</h3>
              <div className="space-y-2">
                <button type="submit" disabled={isPending} onClick={() => setSubmitStatus("published")}
                  className="w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
                  ✅ Update & Publish
                </button>
                <button type="submit" disabled={isPending} onClick={() => setSubmitStatus("draft")}
                  className="w-full py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50">
                  Save as Draft
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Featured Image</h3>
              {imageUrl ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Featured" className="w-full h-36 object-cover rounded-lg" />
                  <button type="button" onClick={() => setImageUrl("")} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg py-6 cursor-pointer hover:border-emerald-300 transition-colors">
                  {imageUploading ? <Loader2 size={20} className="text-slate-400 animate-spin" /> : <Upload size={20} className="text-slate-400" />}
                  <span className="text-xs text-slate-400 mt-2">{imageUploading ? "Uploading..." : "Click to upload"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} disabled={imageUploading} />
                </label>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                <select name="category" required defaultValue={post.category}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags</label>
                <input name="tags" defaultValue={post.tags?.join(", ")}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm">SEO Settings</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Title</label>
                <input name="metaTitle" defaultValue={post.metaTitle} maxLength={60}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Description</label>
                <textarea name="metaDescription" defaultValue={post.metaDescription} maxLength={160} rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
