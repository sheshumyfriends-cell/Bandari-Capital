// scripts/seed.js
// Simple seed script to create an admin user and sample data
const mongoose = require('mongoose');
const dbConnect = require('../src/lib/mongodb');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Investment = require('../src/models/Investment');
const bcrypt = require('bcryptjs');

async function seed() {
  await dbConnect();

  const adminEmail = 'admin@bandari.local';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const passwordHash = await bcrypt.hash('AdminPass123!', 10);
    await User.create({ name: 'Bandari Admin', email: adminEmail, passwordHash, role: 'admin', emailVerified: true });
    console.log('Created admin user: ', adminEmail, ' password: AdminPass123!');
  } else {
    console.log('Admin already exists');
  }

  // Sample investments
  const sampleInvestments = [
    { companyName: 'Acme Corp', reason: 'Strong moat, recurring revenue', invested: true },
    { companyName: 'Beta Systems', reason: 'Undervalued, high growth potential', invested: false }
  ];

  for (const s of sampleInvestments) {
    const exists = await Investment.findOne({ companyName: s.companyName });
    if (!exists) await Investment.create(s);
  }

  // Sample post
  const postExists = await Post.findOne({ title: 'Sample Research Note' });
  if (!postExists) {
    const admin = await User.findOne({ email: adminEmail });
    await Post.create({ title: 'Sample Research Note', content: 'This is a starter research note for Bandari Capital.', author: admin._id });
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
