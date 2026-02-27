"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function toggleBlogStatus(blogId: string) {
  try {
    await connectDB();
    const blog = await Blog.findById(blogId);
    if (!blog) return { success: false, error: "Blog not found" };

    blog.status = blog.status === "published" ? "draft" : "published";
    await blog.save();

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/blog/${blog.slug}`);

    return { success: true, newStatus: blog.status };
  } catch (error) {
    console.error("[Blog] Toggle status failed:", error);
    return { success: false, error: "Failed to update blog status." };
  }
}

export async function deleteBlog(blogId: string) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(blogId);

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("[Blog] Delete failed:", error);
    return { success: false, error: "Failed to delete blog." };
  }
}

export async function incrementViews(blogId: string) {
  try {
    await connectDB();
    await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
  } catch {
    // Non-critical, swallow error
  }
}
