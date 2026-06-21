import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Investment from '../../models/Investment';
import Position from '../../models/Position';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import User from '../../models/User';
import { z } from 'zod';
import { checkRateLimit } from '../../lib/rateLimiter';
import { createAudit } from '../../lib/audit';

const invSchema = z.object({
  companyName: z.string().min(1),
  exchange: z.string().optional(),
  sector: z.string().optional(),
  country: z.string().optional(),
  entryDate: z.preprocess((v) => (v ? new Date(v as string) : undefined), z.date().optional()),
  entryPrice: z.number().optional(),
  quantity: z.number().optional(),
  invested: z.boolean().optional(),
  investmentThesis: z.string().optional(),
  documents: z.array(z.object({ url: z.string(), name: z.string().optional() })).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'ip') as string;
  const rl = await checkRateLimit(ip);
  if (!rl.ok) return res.status(429).json({ error: 'Rate limit exceeded' });

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

    const parse = invSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Invalid payload', issues: parse.error.format() });

    const inv = await Investment.create(parse.data);

    // Create initial Position if quantity provided
    if (parse.data.quantity && parse.data.entryPrice) {
      await Position.create({
        companyName: parse.data.companyName,
        symbol: parse.data.companyName,
        exchange: parse.data.exchange,
        country: parse.data.country,
        sector: parse.data.sector,
        entryDate: parse.data.entryDate,
        entryPrice: parse.data.entryPrice,
        quantity: parse.data.quantity,
        remainingQuantity: parse.data.quantity,
        status: 'invested',
        journal: [{ type: 'initiated', note: 'Position created from investment entry', user: user._id }]
      });
    }

    await createAudit({ user: user._id, action: 'create', collection: 'Investment', documentId: inv._id, oldValue: null, newValue: inv });

    return res.status(201).json(inv);
  }

  if (req.method === 'PUT') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { id, updates } = req.body;
    const before = await Investment.findById(id);
    const inv = await Investment.findByIdAndUpdate(id, updates, { new: true });
    await createAudit({ user: user._id, action: 'update', collection: 'Investment', documentId: inv?._id, oldValue: before, newValue: inv });
    return res.status(200).json(inv);
  }

  if (req.method === 'DELETE') {
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { id } = req.body;
    const before = await Investment.findById(id);
    await Investment.findByIdAndDelete(id);
    await createAudit({ user: user._id, action: 'delete', collection: 'Investment', documentId: before?._id, oldValue: before, newValue: null });
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
