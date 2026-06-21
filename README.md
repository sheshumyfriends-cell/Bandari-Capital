# Bandari Capital — Starter Fullstack Project

This repository is a starter scaffold for Bandari Capital: a modern, responsive full-stack web application built with Next.js (frontend + API routes), MongoDB (via Mongoose), and NextAuth for authentication (Google OAuth + credentials). It implements role-based access (admin vs client), a feed for research posts, an investments house view, and a client portfolio model. This scaffold provides the initial structure, environment templates, seed data, and instructions to continue development.

Key features in this scaffold
- Next.js app using pages/ router for simplicity
- NextAuth with Google OAuth + Credentials provider
- Mongoose models for User, Post, Investment
- API route skeletons for posts and investments with role-based checks
- Seed script to create sample companies and an admin user
- .env.example with required environment variables

Quick start
1. Clone the repo and checkout the branch:
   git clone git@github.com:sheshumyfriends-cell/Bandari-Capital.git
   cd Bandari-Capital
   git checkout init/bandari-capital-starter-2

2. Install dependencies:
   npm install

3. Create a .env file from .env.example and fill values (MongoDB URI, Google OAuth credentials, NextAuth secret, SMTP for emails):
   cp .env.example .env

4. Seed the database with sample data:
   npm run seed

5. Run the dev server:
   npm run dev

What's included and next steps
- The scaffold covers authentication, role checks, and basic APIs; to complete the product you'll need to:
  - Implement UI for admin panel and client dashboard (Portfolio, Feed, Companies Portfolio)
  - Wire up email sending for contact form, verification and password reset (SMTP provider)
  - Add file uploads (images/documents) — consider using a storage provider (S3, Cloudinary)
  - Add notifications (webpush or in-app) for new posts/investments
  - Harden security, validations, and tests

See the repository files for API and model examples.
