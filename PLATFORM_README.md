Frontendpedia Platform (SaaS) - Deployment & Setup

Overview
- Website (blog) stays untouched at repository root and can be deployed as-is to Vercel.
- Platform (SaaS dashboard) uses the TailAdmin template located at free-nextjs-admin-dashboard-main/ and should be deployed as a separate Vercel project by pointing Root Directory to that folder.
- No code changes to the existing website are required.

Projects
1) Website (root)
   - Framework: Next.js 14 (App Router), Tailwind CSS v3
   - Deploy: Create a Vercel project with Root Directory = repository root
   - Domains: frontendpedia.com (and www)

2) Platform (SaaS)
   - Framework: Next.js 15 (App Router), React 19, Tailwind CSS v4
   - Source: platform-saas-main/
   - Deploy: Create a separate Vercel project with Root Directory set to platform-saas-main
   - Domains: platform.frontendpedia.com

Quick Start (Local)
1) Install dependencies for website (optional if you only need platform):
   - pnpm install (or npm install) at repository root

2) Install and run Platform app:
   - cd platform-saas-main
   - npm install
   - npm run dev

3) Visit:
   - Platform (local): http://localhost:3000

Vercel Deployment (Two Projects)
Website project
- New Project → Import GitHub repo
- Framework Preset: Next.js
- Root Directory: /
- Build Command: next build (auto)
- Output Directory: .next (auto)
- Environment Variables: use your existing ones
- Domain: frontendpedia.com (and www)

Platform project
- New Project → Import same GitHub repo
- Framework Preset: Next.js
- Root Directory: platform-saas-main
- Build Command: next build (auto)
- Output Directory: .next (auto)
- Environment Variables: copy from platform-saas-main/ENVIRONMENT.md template to Vercel Project Settings → Environment Variables
- Domain: platform.frontendpedia.com

Environment Variables (Platform)
- Copy the template from platform-saas-main/ENVIRONMENT.md into a local .env.local and into Vercel Project Settings in production (optional; app boots without credentials by default).

Open Source / Free Stack (Current State)
- Next.js 15, React 19, Tailwind CSS v4 (Platform)
- Next.js 14, Tailwind CSS v3 (Website)
- No paid services required to boot either app

Notes
- Keep the two apps deployed as separate Vercel projects for clean isolation and independent releases.
- When you’re ready to add auth/payments/DB to the Platform, we’ll introduce NextAuth, Stripe, and Vercel Postgres/Redis using only open-source SDKs and free tiers.
- Social auth: the platform sign-in page now forwards users back to their original destination using NextAuth’s `callbackUrl`. If you deep-link users to a protected route, append `?callbackUrl=<path>` and they’ll be returned to the dashboard after Google/GitHub login.
- Avatar images from Google/GitHub require the remote domains declared in `next.config.ts` (`lh3.googleusercontent.com`, `avatars.githubusercontent.com`). Restart the dev server after updating that config.


