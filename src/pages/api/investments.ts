import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Investment from '../../../models/Investment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions as any);

  if (req.method === 'GET') {
    const investments = await Investment.find({}).sort({ createdAt: -1 });
    return res.status(200).json(investments);
  }

  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const inv = await Investment.create(req.body);
    return res.status(201).json(inv);
  }

  if (req.method === 'PUT') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { id, updates } = req.body;
    const inv = await Investment.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json(inv);
  }

  if (req.method === 'DELETE') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.body;
    await Investment.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
