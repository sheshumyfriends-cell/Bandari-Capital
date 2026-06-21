// src/models/Investment.js
const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  reason: { type: String },
  invested: { type: Boolean, default: false },
  linkedResearch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
