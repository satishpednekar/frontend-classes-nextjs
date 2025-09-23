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

# Auth (add when enabling NextAuth)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=replace-with-a-strong-secret
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=

# Database (add when enabling Prisma/Vercel Postgres)
# DATABASE_URL=

# Payments (add when enabling Stripe)
# STRIPE_PUBLISHABLE_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=

# Analytics (optional)
# SENTRY_DSN=
```

Vercel (Production/Staging)
- Go to: Project Settings → Environment Variables
- Add any required variables from the template above.
- Re-deploy to apply changes.


