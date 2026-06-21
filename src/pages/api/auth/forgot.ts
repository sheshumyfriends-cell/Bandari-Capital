import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ ok: true }); // don't reveal
  const token = jwt.sign({ id: user._id }, process.env.NEXTAUTH_SECRET || 'secret', { expiresIn: '1h' });
  const url = `${process.env.NEXTAUTH_URL}/client/verify?token=${token}`;
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT||587), auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: 'Password reset', text: `Reset: ${url}` });
  return res.status(200).json({ ok: true });
}
