// scripts/seed.ts — seeds admin, a client, investments and a post
import dbConnect from '../src/lib/mongodb';
import User from '../src/models/User';
import Investment from '../src/models/Investment';
import Post from '../src/models/Post';
import bcrypt from 'bcryptjs';

async function seed() {
  await dbConnect();
  const adminEmail = 'admin@bandari.local';
  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await bcrypt.hash('AdminPass123!', 10);
    await User.create({ name: 'Bandari Admin', email: adminEmail, passwordHash, role: 'admin', emailVerified: true });
    console.log('Created admin user:', adminEmail);
  }

  const clientEmail = 'client@bandari.local';
  const client = await User.findOne({ email: clientEmail });
  if (!client) {
    const passwordHash = await bcrypt.hash('ClientPass123!', 10);
    await User.create({ name: 'Sample Client', email: clientEmail, passwordHash, role: 'client', emailVerified: true });
    console.log('Created client user:', clientEmail);
  }

  const invs = [
    { companyName: 'Acme Corp', sector: 'Technology', country: 'India', entryPrice: 120, entryDate: new Date(), invested: true },
    { companyName: 'Beta Systems', sector: 'Industrials', country: 'India', entryPrice: 45, entryDate: new Date(), invested: false }
  ];
  for (const i of invs) {
    const exists = await Investment.findOne({ companyName: i.companyName });
    if (!exists) await Investment.create(i);
  }

  const postExists = await Post.findOne({ title: 'Sample Research Note' });
  if (!postExists) {
    const admin = await User.findOne({ email: adminEmail });
    await Post.create({ title: 'Sample Research Note', content: 'Starter research note.', author: admin._id, tags: ['starter'] });
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
