import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'client', emailVerified: false });

  // send verification email (basic)
  const token = jwt.sign({ id: user._id }, process.env.NEXTAUTH_SECRET || 'secret', { expiresIn: '7d' });
  const verifyUrl = `${process.env.NEXTAUTH_URL}/client/verify?token=${token}`;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: 'Verify your Bandari Capital account', text: `Click to verify: ${verifyUrl}` });

  return res.status(201).json({ success: true });
}
