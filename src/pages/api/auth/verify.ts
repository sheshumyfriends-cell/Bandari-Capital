import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: any, res: any) {
  await dbConnect();
  if (req.method !== 'GET') return res.status(405).end();
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'token required' });
  try {
    const payload: any = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.emailVerified = true;
    await user.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
}
