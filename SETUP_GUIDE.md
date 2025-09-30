# Database Setup Guide - Frontendpedia SaaS Platform

This guide walks you through setting up the PostgreSQL database with Prisma for the Frontendpedia SaaS platform.

---

## Prerequisites

- Node.js 18+ installed
- Vercel account (for Vercel Postgres)
- Access to the platform codebase in `platform-saas-main/`

---

## Step 1: Install Dependencies

Navigate to the platform directory and install dependencies:

```bash
cd platform-saas-main
npm install
# or
pnpm install
```

---

## Step 2: Set Up Vercel Postgres

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```

4. **Create Postgres database**:
   ```bash
   vercel postgres create
   ```

5. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Copy the connection strings:
   - `POSTGRES_URL` (for pooled connections)
   - `POSTGRES_URL_NON_POOLING` (for migrations)

6. Add to `.env.local`:
   ```env
   DATABASE_URL="your-postgres-url-here"
   DIRECT_URL="your-postgres-url-non-pooling-here"
   ```

---

## Step 3: Configure Prisma

The Prisma schema is already created at `platform-saas-main/prisma/schema.prisma`.

Update your `.env.local` file if needed:

```env
# Database URLs from Vercel Postgres
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (existing)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Admin Emails (comma-separated)
ADMIN_EMAILS="admin@example.com,admin2@example.com"
```

---

## Step 4: Run Prisma Migrations

Create the database schema:

```bash
cd platform-saas-main

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create all tables in your database
# 2. Generate TypeScript types
# 3. Update Prisma Client
```

---

## Step 5: Seed the Database

Populate the database with initial data (roles, permissions, achievements, feature flags):

```bash
npx prisma db seed
```

This will create:
- ✅ System roles (admin, pro_user, free_user, instructor, moderator)
- ✅ System permissions (user:read, content:create, etc.)
- ✅ Role-permission mappings
- ✅ Sample achievements
- ✅ Feature flags

---

## Step 6: Verify Database Setup

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

This opens a browser-based GUI at `http://localhost:5555` where you can:
- View all tables
- Inspect data
- Run queries
- Test relationships

---

## Step 7: Update package.json

Add the seed command to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Install `tsx` for TypeScript execution:

```bash
npm install -D tsx
```

---

## Step 8: Test the API

Start the development server:

```bash
npm run dev
```

Test the profile API:

1. **Sign in** to get a session
2. **Get profile**: 
   ```bash
   curl http://localhost:3000/api/profile
   ```
3. **Create profile**:
   ```bash
   curl -X POST http://localhost:3000/api/profile \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "experienceLevel": "INTERMEDIATE",
       "interests": ["React", "TypeScript"],
       "learningGoals": ["Master Next.js", "Learn System Design"]
     }'
   ```

---

## Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | Authentication and user identity (NextAuth) |
| `user_profiles` | Extended user information and learning preferences |
| `roles` | Role definitions (admin, pro_user, etc.) |
| `permissions` | Granular permissions (resource:action) |
| `user_roles` | User role assignments with expiration |
| `subscriptions` | Billing and subscription management |
| `content` | Learning materials (posts, videos, courses) |
| `learning_paths` | Curated learning journeys |
| `progress_tracking` | User progress on content |
| `achievements` | Gamification achievements |
| `activity_logs` | User activity tracking |

See `DATABASE_DESIGN.md` for complete documentation.

---

## Common Operations

### Create a New Migration

After updating the Prisma schema:

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run seed script

### Deploy to Production

```bash
# Push schema changes without creating migration files
npx prisma db push

# Or generate and apply migrations
npx prisma migrate deploy
```

---

## Troubleshooting

### Connection Error

If you get connection errors:

1. **Check environment variables** in `.env.local`
2. **Verify database is running** (Vercel dashboard)
3. **Check SSL mode** - Vercel requires `?sslmode=require`
4. **Test connection**:
   ```bash
   npx prisma db execute --stdin < /dev/null
   ```

### Migration Conflicts

If migrations conflict:

```bash
# Mark migrations as applied without running them
npx prisma migrate resolve --applied <migration-name>

# Or reset and start fresh (dev only)
npx prisma migrate reset
```

### Seed Errors

If seeding fails:

1. **Check database connection**
2. **Verify migrations ran successfully**: `npx prisma migrate status`
3. **Run seed manually**: `npm run prisma:seed`
4. **Check seed logs** for specific errors

---

## Next Steps

After database setup:

1. ✅ **Test Authentication**: Sign in with Google/GitHub OAuth
2. ✅ **Create Profile**: Use the `/api/profile` endpoint
3. ✅ **Assign Roles**: Use permission utilities in `src/lib/auth/permissions.ts`
4. ✅ **Test RBAC**: Verify role-based access control
5. ✅ **Integrate UI**: Add user profile page with `UserProfileForm` component
6. ✅ **Set Up Stripe**: Configure subscription billing
7. ✅ **Add Content**: Create learning content and paths

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Environment variables set in Vercel dashboard
- [ ] Database connection pooling configured
- [ ] Migrations applied: `npx prisma migrate deploy`
- [ ] Seed data populated (roles, permissions, achievements)
- [ ] Database indexes verified
- [ ] Connection limits configured (Prisma connection pool)
- [ ] Backup strategy in place
- [ ] Monitoring enabled (Vercel logs, Sentry)

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js Documentation](https://next-auth.js.org)
- `DATABASE_DESIGN.md` - Complete database architecture
- `project-detail.md` - Project overview and roadmap

---

## Support

For questions or issues:
1. Check `DATABASE_DESIGN.md` for schema details
2. Review Prisma logs: `npx prisma --help`
3. Check Vercel logs in dashboard
4. Consult the project team
