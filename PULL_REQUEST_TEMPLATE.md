---
name: Bandari Capital — Core MVP PR
about: Core MVP for Bandari Capital platform: auth, models, API routes, admin CRUD, uploads, seed, and deployment notes.
---

## What’s included

This PR implements the Core MVP for the Bandari Capital platform. It includes:

- TypeScript + Next.js project scaffold with Tailwind CSS and a Bandari color palette (dark blue / gold)
- Mongoose models: User, Post, Investment
- NextAuth configuration (Google + Credentials providers) with JWT sessions
- API routes:
  - /api/posts — public GET, admin POST
  - /api/investments — public GET, admin POST/PUT/DELETE
  - /api/upload — Cloudinary upload endpoint (multipart)
  - /api/auth/register — client registration (sends verification email)
  - /api/auth/verify — email verification
  - /api/auth/forgot — send reset email
  - /api/auth/reset — reset password with token
- Admin UI pages: dashboard, posts management, investments management, login
- Client dashboard skeleton (requires further UI and charts)
- Cloudinary helper and upload integration
- Nodemailer-based email flows (configure SMTP in .env)
- Seed script to create admin (admin@bandari.local) and sample client
- .env.example and README with setup & Vercel deployment notes

## Checklist
- [x] Project scaffold (TypeScript + Next.js)
- [x] Auth with NextAuth
- [x] Mongoose models and APIs
- [x] Admin CRUD pages and routes
- [x] Cloudinary upload endpoint
- [x] Email verification & reset scaffolding
- [x] Seed script and sample data
- [ ] UI polish (charts, detailed dashboards) — follow-up
- [ ] Market data integration (Finnhub) — follow-up

## Notes
- Default seeded admin: `admin@bandari.local` / `AdminPass123!` (please rotate immediately)
- Default seeded client: `client@bandari.local` / `ClientPass123!`
- Set required environment variables listed in `.env.example` before running

## Deployment
- The app is ready for deployment on Vercel. Ensure environment variables are set in the Vercel project settings.

If you'd like, I can merge this PR after your review or keep it open for incremental updates (market data, UI polish, notifications).