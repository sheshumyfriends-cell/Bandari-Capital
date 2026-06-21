import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, password });
    if ((res as any)?.ok) router.push('/admin/dashboard');
    else alert('Login failed');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bandari-900 text-white">
      <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <label className="block text-sm">Email</label>
        <input className="w-full p-2 rounded mt-1 text-black" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block text-sm mt-3">Password</label>
        <input type="password" className="w-full p-2 rounded mt-1 text-black" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="mt-6 w-full bg-gold text-bandari-900 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
