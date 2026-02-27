import { z } from "zod";

export const CommentSchema = z.object({
  blogId: z.string().min(1, "Blog ID is required"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),
  email: z.string().email("Invalid email address"),
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment too long (max 1000 chars)"),
});

export const BlogSearchSchema = z.object({
  query: z.string().min(1).max(200),
  category: z
    .enum(["Markets", "Investing", "Insurance", "Loans", "Crypto", "Economy", "Personal Finance", "All"])
    .optional(),
  page: z.number().int().positive().optional().default(1),
});

export type CommentInput = z.infer<typeof CommentSchema>;
export type BlogSearchInput = z.infer<typeof BlogSearchSchema>;
