Frontendpedia Platform (TailAdmin) - Environment Setup

Purpose
- This file documents the environment variables for the platform app located in this folder.
- The app runs fine without credentials; add variables when enabling auth, DB, payments, or analytics.

Local Development
1) Create a local env file:
   - Copy this template into a new file named .env.local

Template
```
# App
NEXT_PUBLIC_APP_NAME=Frontendpedia Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-strong-secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Credentials Auth (optional)
# Provide NEXTAUTH_SECRET and set ALLOW_EMAIL_SIGNIN=true to enable email/password flow
ALLOW_EMAIL_SIGNIN=true

# Database (required)
# Copy the generated values from Vercel (Environment Variables → Storage → Postgres)
#   DATABASE_POSTGRES_URL       → use as DATABASE_URL (pooled, pgbouncer)
#   DATABASE_PRISMA_URL → use as PRISMA_ACCELERATE_URL (if Accelerate enabled)
#   DATABASE_PRISMA_DIRECT_URL → use as DIRECT_URL (non-pooled)
DATABASE_URL=""
DIRECT_URL=""
PRISMA_ACCELERATE_URL=""

# Payments (add when enabling Stripe)
# STRIPE_PUBLISHABLE_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=

# Analytics (optional)
# SENTRY_DSN=
```

Validation Checklist
- [ ] NEXTAUTH_SECRET set and kept private
- [ ] DATABASE_URL present in local and Vercel envs
- [ ] DIRECT_URL set for Prisma migrations
- [ ] OAuth credentials configured for Google/GitHub
- [ ] NEXTAUTH_URL matches environment domain
- [ ] RUN `pnpm prisma migrate deploy` before first deploy

Vercel (Production/Staging)
- Go to: Project Settings → Environment Variables
- Add all required variables from the template above across environments (Development, Preview, Production).
- Re-deploy to apply changes.


