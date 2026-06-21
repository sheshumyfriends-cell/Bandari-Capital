import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export function requireRole(role: 'admin' | 'client' | 'partner' | 'viewer') {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions as any);
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    const userRole = (session.user as any).role;
    if (!userRole) return res.status(403).json({ error: 'Forbidden' });
    // admin / super-admin can access everything
    if (userRole === 'admin') return;
    // simple role check: allow if same or higher privileges (you can extend mapping later)
    if (role === 'client' && ['client','partner','admin'].includes(userRole)) return;
    if (role === 'partner' && ['partner','admin'].includes(userRole)) return;
    if (role === 'viewer' && ['viewer','partner','admin','client'].includes(userRole)) return;
    res.status(403).json({ error: 'Forbidden' });
  };
}
