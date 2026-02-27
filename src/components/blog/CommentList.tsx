import { IComment } from "@/models/Comment";
import { timeAgo } from "@/lib/utils";
import { User, MessageSquare } from "lucide-react";

interface CommentListProps {
  comments: Pick<IComment, "_id" | "name" | "content" | "createdAt">[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={String(comment._id)}
          className="flex gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-sm font-semibold text-slate-900">
                {comment.name}
              </span>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
