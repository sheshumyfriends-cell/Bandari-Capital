import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
  companyName: string;
  exchange?: string;
  sector?: string;
  country?: string;
  entryDate?: Date;
  entryPrice?: number;
  invested: boolean;
  investmentThesis?: string;
  documents: { url: string; name?: string }[];
  createdAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  companyName: { type: String, required: true },
  exchange: { type: String },
  sector: { type: String },
  country: { type: String },
  entryDate: { type: Date },
  entryPrice: { type: Number },
  invested: { type: Boolean, default: false },
  investmentThesis: { type: String },
  documents: [{ url: String, name: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);
