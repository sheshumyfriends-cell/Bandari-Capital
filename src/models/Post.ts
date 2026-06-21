import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content?: string;
  images: { url: string; caption?: string }[];
  documents: { url: string; name?: string }[];
  tags: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String },
  images: [{ url: String, caption: String }],
  documents: [{ url: String, name: String }],
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
