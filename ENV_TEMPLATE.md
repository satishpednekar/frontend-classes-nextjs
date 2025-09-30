# Environment Variables Template

Copy these variables to your `.env.local` file in the `platform-saas-main/` directory.

```env
# ============================================================================
# DATABASE (Vercel Postgres)
# ============================================================================
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"

# ============================================================================
# NEXTAUTH CONFIGURATION
# ============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
ALLOW_EMAIL_SIGNIN="true"

# ============================================================================
# OAUTH PROVIDERS
# ============================================================================
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# ============================================================================
# ADMIN CONFIGURATION
# ============================================================================
ADMIN_EMAILS="admin@example.com"

# ============================================================================
# STRIPE (Payment Processing)
# ============================================================================
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ============================================================================
# EMAIL (Resend)
# ============================================================================
RESEND_API_KEY="re_..."

# ============================================================================
# AI (OpenAI) - Optional
# ============================================================================
OPENAI_API_KEY="sk-..."

# ============================================================================
# SITE CONFIGURATION
# ============================================================================
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

See `SETUP_GUIDE.md` for detailed instructions on obtaining these values.
