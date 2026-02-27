import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai";

  await connectDB();
  const blogs = await Blog.find({ status: "published" })
    .select("slug updatedAt")
    .sort({ updatedAt: -1 })
    .lean();

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categories = ["markets", "investing", "insurance", "loans", "crypto", "economy", "personal-finance"];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...blogUrls,
  ];
}
