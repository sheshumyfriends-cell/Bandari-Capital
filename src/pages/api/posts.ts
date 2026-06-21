import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions as any);
  if (req.method === 'GET') {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('author', 'name email');
    return res.status(200).json(posts);
  }
  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { title, content, images, documents, tags } = req.body;
    const post = await Post.create({ title, content, images, documents, tags, author: user._id });
    return res.status(201).json(post);
  }
  return res.status(405).end();
}
