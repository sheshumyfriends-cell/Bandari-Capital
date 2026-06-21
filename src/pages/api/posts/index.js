// src/pages/api/posts/index.js
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import { getSession } from 'next-auth/react';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getSession({ req });

  if (req.method === 'GET') {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('author', 'name email');
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    // Only admin can create posts
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { title, content, images, documents } = req.body;
    const post = await Post.create({ title, content, images, documents, author: user._id });
    return res.status(201).json(post);
  }

  return res.status(405).end();
}
