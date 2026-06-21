import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminInvestments() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [entryPrice, setEntryPrice] = useState('');

  async function fetchInvestments() {
    const { data } = await axios.get('/api/investments');
    setInvestments(data);
  }

  useEffect(() => { fetchInvestments(); }, []);

  async function addInvestment(e: any) {
    e.preventDefault();
    await axios.post('/api/investments', { companyName, entryPrice: Number(entryPrice), invested: true });
    setCompanyName(''); setEntryPrice('');
    fetchInvestments();
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Manage Investments</h1>
      <form onSubmit={addInvestment} className="mt-4 grid gap-2 max-w-2xl">
        <input className="p-2 border rounded" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Entry Price" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
        <div className="flex gap-2"><button className="px-4 py-2 bg-bandari-700 text-white rounded">Add Investment</button></div>
      </form>

      <div className="mt-8">
        {investments.map(i => (
          <div key={i._id} className="p-4 border rounded mb-4">
            <div className="flex justify-between"><strong>{i.companyName}</strong><span>{i.sector || ''}</span></div>
            <div className="text-sm text-gray-600">Entry Price: {i.entryPrice ?? '—'}</div>
            <p className="mt-2 text-sm text-gray-800">{i.investmentThesis}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
