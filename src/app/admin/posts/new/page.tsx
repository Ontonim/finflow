"use client";

import { useState, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/post.actions";
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

const INITIAL_STATE = { success: false, error: null as string | null, slug: undefined as string | undefined };

export default function NewPostPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createPost, INITIAL_STATE);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"published" | "draft">("published");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect after successful creation
  if (state.success && state.slug) {
    router.push(`/admin`);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setImageError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        insertAtCursor(`<img src="${data.url}" alt="Article image" class="w-full rounded-lg my-4" />`);
      } else {
        setImageError(data.error || "Upload failed");
      }
    } catch {
      setImageError("Upload failed. Check your IMGBB_API_KEY.");
    } finally {
      setImageUploading(false);
    }
  };

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
      if (data.url) {
        setImageUrl(data.url);
      } else {
        setImageError(data.error || "Upload failed");
      }
    } catch {
      setImageError("Upload failed. Check your IMGBB_API_KEY.");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NextLink href="/admin" className="text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft size={20} />
            </NextLink>
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="font-bold text-slate-900 text-lg"
            >
              New Article
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
        {/* Hidden fields */}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="featuredImage" value={imageUrl} />
        <input type="hidden" name="status" value={submitStatus} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <input
                name="title"
                placeholder="Article Title..."
                required
                className="w-full text-2xl font-bold text-slate-900 border-none outline-none placeholder:text-slate-300"
                style={{ fontFamily: "'Playfair Display', serif" }}
              />
              <div className="h-px bg-slate-100 my-3" />
              <textarea
                name="excerpt"
                placeholder="Short excerpt (shown on article cards, ~160 characters)..."
                rows={2}
                required
                className="w-full text-sm text-slate-500 border-none outline-none resize-none placeholder:text-slate-300"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50">
                {toolbarButtons.map(({ icon: Icon, label, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    title={label}
                    className="p-2 rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-800 transition-all"
                  >
                    <Icon size={15} />
                  </button>
                ))}
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <label
                  title="Insert Image"
                  className="p-2 rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  {imageUploading ? <Loader2 size={15} className="animate-spin" /> : <Image size={15} />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Editor / Preview */}
              {preview ? (
                <div
                  className="article-content p-6 min-h-[400px] prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || "<p class='text-slate-300'>Nothing to preview yet...</p>" }}
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your article in HTML... Use the toolbar above to format. e.g. <h2>Section Title</h2><p>Your content here...</p>"
                  className="w-full p-5 min-h-[400px] text-sm text-slate-700 border-none outline-none resize-y font-mono leading-relaxed"
                />
              )}
            </div>

            {/* Error from server action */}
            {state.error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                ⚠️ {state.error}
              </div>
            )}
            {imageError && (
              <div className="text-amber-600 text-sm bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
                ⚠️ Image: {imageError}
              </div>
            )}
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-4">
            {/* Publish Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm">Publish</h3>
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isPending}
                  onClick={() => setSubmitStatus("published")}
                  className="w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending && submitStatus === "published" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : null}
                  🚀 Publish Article
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  onClick={() => setSubmitStatus("draft")}
                  className="w-full py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Featured Image</h3>
              {imageUrl ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Featured" className="w-full h-36 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg py-6 cursor-pointer hover:border-emerald-300 transition-colors">
                  {imageUploading ? (
                    <Loader2 size={20} className="text-slate-400 animate-spin" />
                  ) : (
                    <Upload size={20} className="text-slate-400" />
                  )}
                  <span className="text-xs text-slate-400 mt-2">
                    {imageUploading ? "Uploading..." : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedImageUpload}
                    disabled={imageUploading}
                  />
                </label>
              )}
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                <select
                  name="category"
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags</label>
                <input
                  name="tags"
                  placeholder="e.g. investing, stocks, S&P 500"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm">SEO Settings</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Title</label>
                <input
                  name="metaTitle"
                  placeholder="SEO title (55-60 chars)"
                  maxLength={60}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  placeholder="SEO description (150-160 chars)"
                  maxLength={160}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
