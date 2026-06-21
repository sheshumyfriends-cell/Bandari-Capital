import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  const { token, password } = req.body;
  try {
    const payload: any = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(400).json({ error: 'Invalid token' });
  }
}
