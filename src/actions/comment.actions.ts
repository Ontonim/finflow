"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { CommentSchema } from "@/lib/validations";

export async function submitComment(formData: FormData) {
  const raw = {
    blogId: formData.get("blogId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    content: formData.get("content") as string,
  };

  const result = CommentSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    await connectDB();
    await Comment.create({
      blogId: result.data.blogId,
      name: result.data.name,
      email: result.data.email,
      content: result.data.content,
      isApproved: false,
    });

    revalidatePath(`/blog/[slug]`, "page");

    return {
      success: true,
      message: "Comment submitted! It will appear after moderation.",
    };
  } catch (error) {
    console.error("[Comment] Submit failed:", error);
    return { success: false, error: "Failed to submit comment. Try again." };
  }
}

export async function toggleCommentApproval(commentId: string) {
  try {
    await connectDB();
    const comment = await Comment.findById(commentId);
    if (!comment) return { success: false, error: "Comment not found" };

    comment.isApproved = !comment.isApproved;
    await comment.save();

    revalidatePath("/admin/comments");
    revalidatePath("/blog/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("[Comment] Toggle failed:", error);
    return { success: false, error: "Failed to update comment." };
  }
}

export async function deleteComment(commentId: string) {
  try {
    await connectDB();
    await Comment.findByIdAndDelete(commentId);

    revalidatePath("/admin/comments");
    revalidatePath("/blog/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("[Comment] Delete failed:", error);
    return { success: false, error: "Failed to delete comment." };
  }
}
