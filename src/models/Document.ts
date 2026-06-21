import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentFile extends Document {
  title: string;
  company?: string;
  url: string;
  fileType?: string;
  uploadedBy?: mongoose.Types.ObjectId;
  tags?: string[];
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocumentFile>({
  title: { type: String, required: true },
  company: { type: String },
  url: { type: String, required: true },
  fileType: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model<IDocumentFile>('Document', DocumentSchema);
