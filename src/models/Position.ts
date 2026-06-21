import mongoose, { Schema, Document } from 'mongoose';

export type PositionStatus =
  | 'under-research'
  | 'watching'
  | 'accumulating'
  | 'invested'
  | 'reduced'
  | 'exited';

export interface IJournalEntry {
  type: string; // initiated/added/reduced/exited/note
  note?: string;
  user?: mongoose.Types.ObjectId;
  date?: Date;
}

export interface IPosition extends Document {
  companyName: string;
  symbol?: string;
  exchange?: string;
  country?: string;
  sector?: string;
  entryDate?: Date;
  entryPrice?: number;
  quantity?: number;
  positionSize?: number; // percentage
  convictionLevel?: number; // 1-10
  investmentThesis?: string;
  riskFactors?: string[];
  currency?: string;
  status: PositionStatus;

  // partial sell tracking
  soldQuantity?: number;
  remainingQuantity?: number;
  averageCost?: number;
  realizedProfit?: number;
  holdingPeriodDays?: number;
  exitDate?: Date;

  // live data
  lastPrice?: number;
  priceUpdatedAt?: Date;

  journal: IJournalEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema = new Schema<IJournalEntry>({
  type: String,
  note: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

const PositionSchema = new Schema<IPosition>({
  companyName: { type: String, required: true },
  symbol: { type: String },
  exchange: { type: String },
  country: { type: String },
  sector: { type: String },
  entryDate: { type: Date },
  entryPrice: { type: Number },
  quantity: { type: Number },
  positionSize: { type: Number },
  convictionLevel: { type: Number },
  investmentThesis: { type: String },
  riskFactors: [{ type: String }],
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['under-research','watching','accumulating','invested','reduced','exited'], default: 'under-research' },

  soldQuantity: { type: Number, default: 0 },
  remainingQuantity: { type: Number },
  averageCost: { type: Number },
  realizedProfit: { type: Number, default: 0 },
  holdingPeriodDays: { type: Number },
  exitDate: { type: Date },

  lastPrice: { type: Number },
  priceUpdatedAt: { type: Date },

  journal: [JournalSchema]
}, { timestamps: true });

export default mongoose.models.Position || mongoose.model<IPosition>('Position', PositionSchema);
