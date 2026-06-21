import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Post from '../../models/Post';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import User from '../../models/User';
import { z } from 'zod';
import { checkRateLimit } from '../../lib/rateLimiter';
import { createAudit } from '../../lib/audit';

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().optional(),
  images: z.array(z.object({ url: z.string(), caption: z.string().optional() })).optional(),
  documents: z.array(z.object({ url: z.string(), name: z.string().optional() })).optional(),
  tags: z.array(z.string()).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // rate limit by IP
  const ip = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'ip') as string;
  const rl = await checkRateLimit(ip);
  if (!rl.ok) return res.status(429).json({ error: 'Rate limit exceeded' });

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

    const parse = postSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Invalid payload', issues: parse.error.format() });

    const { title, content, images, documents, tags } = parse.data;
    const oldVal = null;
    const post = await Post.create({ title, content, images, documents, tags, author: user._id });

    // audit
    await createAudit({ user: user._id, action: 'create', collection: 'Post', documentId: post._id, oldValue: oldVal, newValue: post });

    return res.status(201).json(post);
  }

  return res.status(405).end();
}
