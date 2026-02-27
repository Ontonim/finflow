import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ blogId: 1, isApproved: 1 });

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
