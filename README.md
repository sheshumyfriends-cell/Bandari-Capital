# Bandari Capital — Full Platform (TypeScript + Next.js + Tailwind + Shadcn UI)

This repository provides a production-ready starter for Bandari Capital: a modern full-stack web application with admin and client portals, role-based access control, file uploads (Cloudinary), email flows (Nodemailer), and live market data hooks.

Quick start (development)
1. Clone & checkout branch:
   git fetch origin
   git checkout -b feature/full-platform-v1 origin/feature/full-platform-v1 || git checkout -b feature/full-platform-v1

2. Install dependencies:
   npm install

3. Copy environment template and fill sensitive values:
   cp .env.example .env

4. Start dev server:
   npm run dev

5. Seed sample data (creates admin + sample client + sample investments/posts):
   npm run seed

Notes
- This scaffold uses TypeScript, Tailwind CSS, and shadcn/ui primitives for a premium UI baseline.
- Fill Cloudinary and SMTP credentials to enable uploads and email flows.
- For live prices, set STOCK_API_PROVIDER and STOCK_API_KEY in .env; helper functions include examples for Finnhub and Yahoo.

Next steps I can implement for you:
- Complete Admin UI pages (create/edit posts, manage investments, client management).
- Advanced client portfolio math + charts (Chart.js or Recharts integration).
- Search and notification services (Realtime via Pusher or Socket.io).
- GitHub Actions + Vercel deployment configuration.
