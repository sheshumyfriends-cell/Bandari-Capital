// src/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  images: [{ url: String, caption: String }],
  documents: [{ url: String, name: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
