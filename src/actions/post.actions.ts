"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { z } from "zod";

const PostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["published", "draft"]),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function estimateReadingTime(content: string): number {
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]+>/g, " ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export type PostState = {
  success: boolean;
  error: string | null;
  slug?: string;
};

export async function createPost(prevState: PostState, formData: FormData): Promise<PostState> {
  const raw = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    tags: formData.get("tags") as string,
    metaTitle: formData.get("metaTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    featuredImage: formData.get("featuredImage") as string,
    status: (formData.get("status") as string) || "draft",
  };

  const validation = PostSchema.safeParse(raw);
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
      success: false,
    };
  }

  const data = validation.data;

  try {
    await connectDB();

    // Auto-generate slug if not provided
    let slug = generateSlug(data.title);
    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const tagsArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const readingTime = estimateReadingTime(data.content);

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: data.metaTitle || data.title,
      description: data.metaDescription || data.excerpt,
      datePublished: new Date().toISOString(),
      publisher: {
        "@type": "Organization",
        name: "FinFlow AI",
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai"}/blog/${slug}`,
      },
    });

    await Blog.create({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      tags: tagsArray,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt,
      featuredImage: data.featuredImage || "",
      sourceUrl: "",
      sourcePublisher: "FinFlow AI",
      status: data.status,
      views: 0,
      readingTime,
      jsonLd,
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, slug, error: null };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updatePost(id: string, prevState: any, formData: FormData) {
  const raw = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    tags: formData.get("tags") as string,
    metaTitle: formData.get("metaTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    featuredImage: formData.get("featuredImage") as string,
    status: (formData.get("status") as string) || "draft",
  };

  const validation = PostSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, success: false };
  }

  const data = validation.data;

  try {
    await connectDB();

    const tagsArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const readingTime = estimateReadingTime(data.content);

    await Blog.findByIdAndUpdate(id, {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      tags: tagsArray,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt,
      featuredImage: data.featuredImage || "",
      status: data.status,
      readingTime,
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, error: null };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
