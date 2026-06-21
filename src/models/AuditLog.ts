import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  action: string;
  collection: string;
  documentId?: mongoose.Types.ObjectId;
  oldValue?: any;
  newValue?: any;
  createdAt: Date;
}

const AuditSchema = new Schema<IAuditLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  collection: { type: String, required: true },
  documentId: { type: Schema.Types.ObjectId },
  oldValue: { type: Schema.Types.Mixed },
  newValue: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditSchema);
