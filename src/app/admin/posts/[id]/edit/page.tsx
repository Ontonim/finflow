import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import EditPostClient from "./EditPostClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  
  await connectDB();
  const post = await Blog.findById(id).lean();

  if (!post) notFound();

  return <EditPostClient post={JSON.parse(JSON.stringify(post))} />;
}
