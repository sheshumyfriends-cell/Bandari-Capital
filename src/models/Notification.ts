import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user?: mongoose.Types.ObjectId; // null = broadcast
  type: string;
  title: string;
  body?: string;
  data?: any;
  read?: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String },
  data: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
