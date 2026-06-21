import mongoose, { Schema, Document } from 'mongoose';

export interface IDividend extends Document {
  position: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentDate: Date;
  declaredDate?: Date;
  createdAt: Date;
}

const DividendSchema = new Schema<IDividend>({
  position: { type: Schema.Types.ObjectId, ref: 'Position' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentDate: { type: Date, required: true },
  declaredDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.Dividend || mongoose.model<IDividend>('Dividend', DividendSchema);
