import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-white text-bandari-900">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Client Dashboard</h1>
        <p className="mt-4 text-sm text-gray-600">Welcome — portfolio overview, research feed, and notifications will appear here.</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return { redirect: { destination: '/client/login', permanent: false } };
  }
  return { props: {} };
};
