import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  async function fetchPosts() {
    const { data } = await axios.get('/api/posts');
    setPosts(data);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function createPost(e: any) {
    e.preventDefault();
    await axios.post('/api/posts', { title, content, tags: [] });
    setTitle(''); setContent('');
    fetchPosts();
  }

  async function deletePost(id: string) {
    // backend DELETE not implemented for posts yet — can add /api/posts/[id]
    if (!confirm('Delete post?')) return;
    // placeholder: optimistic UI
    setPosts(posts.filter(p => p._id !== id));
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Manage Posts</h1>
      <form onSubmit={createPost} className="mt-4 grid gap-2 max-w-2xl">
        <input className="p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="p-2 border rounded" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
        <div className="flex gap-2"><button className="px-4 py-2 bg-bandari-700 text-white rounded">Create</button></div>
      </form>

      <div className="mt-8">
        {posts.map(p => (
          <div key={p._id} className="p-4 border rounded mb-4">
            <div className="flex justify-between"><strong>{p.title}</strong><button onClick={() => deletePost(p._id)} className="text-red-600">Delete</button></div>
            <div className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString()}</div>
            <p className="mt-2 text-sm text-gray-800">{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
