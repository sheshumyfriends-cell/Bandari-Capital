// src/pages/api/investments/index.js
import dbConnect from '../../../lib/mongodb';
import Investment from '../../../models/Investment';
import { getSession } from 'next-auth/react';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getSession({ req });

  if (req.method === 'GET') {
    // Public: show house investments
    const investments = await Investment.find({}).sort({ createdAt: -1 });
    return res.status(200).json(investments);
  }

  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { companyName, reason, invested, linkedResearch } = req.body;
    const inv = await Investment.create({ companyName, reason, invested, linkedResearch });
    return res.status(201).json(inv);
  }

  if (req.method === 'PUT') {
    // Update an investment (admin only)
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { id, updates } = req.body;
    const inv = await Investment.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json(inv);
  }

  if (req.method === 'DELETE') {
    // Delete investment (admin only)
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { id } = req.body;
    await Investment.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
