import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import dbConnect from '../../lib/mongodb';
import Post from '../../models/Post';
import Investment from '../../models/Investment';
import Link from 'next/link';

export default function AdminDashboard({ postsCount, investmentsCount }: any) {
  return (
    <div className="min-h-screen bg-white text-bandari-900">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Research Posts</div>
            <div className="text-xl font-bold">{postsCount}</div>
            <Link href="/admin/posts"><a className="mt-2 inline-block text-sm text-bandari-700">Manage posts</a></Link>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Investments</div>
            <div className="text-xl font-bold">{investmentsCount}</div>
            <Link href="/admin/investments"><a className="mt-2 inline-block text-sm text-bandari-700">Manage investments</a></Link>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Clients</div>
            <div className="text-xl font-bold">—</div>
            <Link href="/admin/clients"><a className="mt-2 inline-block text-sm text-bandari-700">View clients</a></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions as any);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  if ((session.user as any).role !== 'admin') return { redirect: { destination: '/', permanent: false } };

  await dbConnect();
  const postsCount = await Post.countDocuments();
  const investmentsCount = await Investment.countDocuments();

  return { props: { postsCount, investmentsCount } };
}
