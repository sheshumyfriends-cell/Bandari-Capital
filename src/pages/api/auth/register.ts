import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { checkRateLimit } from '../../../lib/rateLimiter';
import { createAudit } from '../../../lib/audit';

const registerSchema = z.object({ name: z.string().optional(), email: z.string().email(), password: z.string().min(8) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'ip') as string;
  const rl = await checkRateLimit(ip);
  if (!rl.ok) return res.status(429).json({ error: 'Rate limit exceeded' });

  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();

  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', issues: parse.error.format() });

  const { name, email, password } = parse.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'client', emailVerified: false });

  const token = jwt.sign({ id: user._id }, process.env.NEXTAUTH_SECRET || 'secret', { expiresIn: '7d' });
  const verifyUrl = `${process.env.NEXTAUTH_URL}/client/verify?token=${token}`;
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: 'Verify your Bandari Capital account', text: `Click to verify: ${verifyUrl}` });

  await createAudit({ user: user._id, action: 'create', collection: 'User', documentId: user._id, oldValue: null, newValue: { email: user.email, role: user.role } });

  return res.status(201).json({ success: true });
}
