import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string; // Raw HTML
  excerpt: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  sourceUrl: string;
  sourcePublisher: string;
  status: "published" | "draft";
  views: number;
  readingTime: number; // minutes
  jsonLd: string; // stringified JSON-LD
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Markets", "Investing", "Insurance", "Loans", "Crypto", "Economy", "Personal Finance"],
      default: "Markets",
    },
    tags: [{ type: String }],
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    sourceUrl: { type: String, required: true },
    sourcePublisher: { type: String, default: "Reuters" },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
      index: true,
    },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 5 },
    jsonLd: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast public queries
BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ category: 1, status: 1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
