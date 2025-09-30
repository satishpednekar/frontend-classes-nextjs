# Frontendpedia SaaS - Database Design & Architecture

**Version:** 1.0  
**Last Updated:** September 30, 2025  
**Database:** PostgreSQL (Vercel Postgres)  
**ORM:** Prisma

---

## Table of Contents
1. [Overview](#overview)
2. [Core Design Principles](#core-design-principles)
3. [Database Schema](#database-schema)
4. [Entity Relationship Diagram](#entity-relationship-diagram)
5. [Domain Models](#domain-models)
6. [Access Control System](#access-control-system)
7. [Subscription & Billing](#subscription--billing)
8. [Learning & Content System](#learning--content-system)
9. [Analytics & Tracking](#analytics--tracking)
10. [Indexes & Performance](#indexes--performance)
11. [Data Privacy & Security](#data-privacy--security)
12. [Migration Strategy](#migration-strategy)

---

## Overview

This document describes the complete database architecture for the Frontendpedia SaaS platform. The design prioritizes:

- **Extensibility**: Easy to add new features without breaking existing functionality
- **Scalability**: Optimized for growth from 50 to 50,000+ users
- **Flexibility**: Support for multiple user types, roles, and permissions
- **Performance**: Proper indexing and query optimization
- **Security**: Role-based access control (RBAC) with fine-grained permissions

---

## Core Design Principles

### 1. Separation of Concerns
- **Authentication** (NextAuth tables) separated from **User Data** (profile, preferences)
- **Authorization** (roles/permissions) decoupled from user identity
- **Billing** (subscriptions) isolated from user profile

### 2. Extensibility Patterns
- JSON fields for flexible metadata without schema changes
- Array fields for tags, interests, and multi-value attributes
- Enum types for controlled vocabularies with room for growth

### 3. Audit & Tracking
- All entities have `createdAt` and `updatedAt` timestamps
- Activity logs capture user actions for analytics
- Subscription logs track billing lifecycle events

### 4. Soft Deletes & Data Retention
- Users can be suspended (`isSuspended`) without deletion
- Cascade deletes configured appropriately to maintain referential integrity

---

## Database Schema

### Core Tables Summary

| Table | Purpose | Key Relations |
|-------|---------|---------------|
| `users` | Core authentication & identity | → profiles, roles, subscriptions |
| `user_profiles` | Extended user information & learning preferences | → users |
| `roles` | Define role types (admin, pro_user, etc.) | → permissions, users |
| `permissions` | Granular access rights | → roles, users |
| `subscriptions` | Billing & plan management | → users, invoices |
| `content` | Learning materials (posts, videos, courses) | → bookmarks, notes |
| `learning_paths` | Curated learning journeys | → users, content |
| `progress_tracking` | User progress on content | → users, content |
| `achievements` | Gamification & milestones | → users |
| `activity_logs` | User action tracking | → users |

---

## Entity Relationship Diagram

```
┌─────────────┐
│   users     │
└──────┬──────┘
       │
       ├─────────────────────────────────────────────────────┐
       │                                                       │
       ├──────────────────┐                                   │
       │                  │                                   │
       ▼                  ▼                                   ▼
┌──────────────┐   ┌──────────────┐                   ┌──────────────┐
│ user_profiles│   │  user_roles  │                   │subscriptions │
└──────────────┘   └──────┬───────┘                   └──────┬───────┘
                          │                                   │
                          │                                   │
                          ▼                                   ▼
                   ┌──────────────┐                   ┌──────────────┐
                   │    roles     │                   │   invoices   │
                   └──────┬───────┘                   └──────────────┘
                          │
                          │
                          ▼
                   ┌──────────────┐
                   │ role_permissions│
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ permissions  │
                   └──────────────┘

┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   content   │◄──────┤  bookmarks   │──────►│    users     │
└──────┬──────┘       └──────────────┘       └──────────────┘
       │
       ├──────────────────────────────────────┐
       │                                       │
       ▼                                       ▼
┌──────────────┐                       ┌──────────────┐
│    notes     │                       │learning_path_│
└──────────────┘                       │   items      │
                                       └──────┬───────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │learning_paths│
                                       └──────────────┘
```

---

## Domain Models

### 1. User & Profile System

#### **users**
Core authentication table managed by NextAuth.

**Fields:**
- `id` (CUID): Primary key
- `email` (unique): User email address
- `name`: Display name from OAuth providers
- `image`: Profile picture URL from OAuth
- `isActive`: Account status flag
- `isSuspended`: Admin suspension flag
- `lastLoginAt`: Last login timestamp for activity tracking

**Relations:**
- One-to-One: `user_profiles`
- One-to-Many: `accounts`, `sessions`, `bookmarks`, `notes`, `learning_paths`
- Many-to-Many: `roles`, `permissions`

---

#### **user_profiles**
Extended user information and learning preferences.

**Sections:**

1. **Personal Information**
   - `firstName`, `lastName`, `displayName`
   - `bio`: User biography (TEXT)
   - `phoneNumber`, `country`, `city`
   - `timezone`, `language`: Localization preferences

2. **Professional Information**
   - `jobTitle`, `company`, `yearsExperience`
   - `linkedinUrl`, `githubUrl`, `portfolioUrl`, `websiteUrl`
   - `domain`: e.g., "frontend", "fullstack"
   - `industry`: e.g., "fintech", "healthcare"

3. **Learning Profile**
   - `experienceLevel`: ENUM (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
   - `learningGoals`: Array of goal strings
   - `interests`: Array of topic strings
   - `skillLevel`: JSON object mapping skills to proficiency (0-10)
   - `preferredLearningStyle`: ENUM (VISUAL, READING, HANDS_ON, VIDEO, MIXED)
   - `weeklyLearningHours`: Target learning commitment

4. **Audience Segmentation**
   - `audienceType`: ENUM (FREE_USER, PRO_USER, TRIAL_USER, ENTERPRISE_USER, STUDENT, INSTRUCTOR, ADMIN)
   - Used for feature gating and content personalization

5. **Tracking & Analytics**
   - `totalLearningMinutes`: Cumulative learning time
   - `streakDays`: Current daily streak
   - `longestStreak`: Best streak achieved
   - `lastActiveDate`: Last activity timestamp
   - `onboardingCompleted`, `onboardingStep`: Onboarding progress

6. **Privacy & Communication**
   - `isProfilePublic`: Profile visibility toggle
   - `allowAnalytics`: Analytics opt-in
   - `allowMarketing`: Marketing communication opt-in

---

### 2. Access Control System (RBAC)

The access control system implements **Role-Based Access Control** with support for:
- Hierarchical roles with priority levels
- Granular permissions at the resource-action level
- Direct user permissions that override role permissions
- Temporary role/permission assignments with expiration

#### **roles**
Define user roles in the system.

**System Roles:**
- `admin`: Full system access
- `instructor`: Can create and manage content
- `moderator`: Can moderate user content and comments
- `pro_user`: Paid subscription features
- `free_user`: Basic access

**Fields:**
- `name` (unique): Role identifier (e.g., "admin")
- `displayName`: Human-readable name
- `priority`: Numeric priority (higher = more powerful)
- `isSystem`: System roles cannot be deleted

---

#### **permissions**
Granular access rights following the pattern: `resource:action`

**Examples:**
- `user:read`, `user:create`, `user:update`, `user:delete`
- `content:create`, `content:publish`, `content:moderate`
- `subscription:manage`, `subscription:view`
- `admin:dashboard`, `admin:users`, `admin:analytics`

**Fields:**
- `name` (unique): Permission identifier (e.g., "content:create")
- `resource`: Resource type (e.g., "content", "user")
- `action`: Action type (e.g., "read", "create", "update", "delete")

---

#### **role_permissions**
Junction table linking roles to permissions (many-to-many).

#### **user_roles**
Junction table assigning roles to users with optional expiration.

**Use Cases:**
- Temporary admin access
- Trial period roles
- Time-limited instructor access

#### **user_permissions**
Direct permissions assigned to specific users (override role permissions).

**Use Cases:**
- Grant specific permission without full role
- Revoke specific permission from a role-assigned user

---

### 3. Subscription & Billing

#### **subscriptions**
User subscription and billing information.

**Tiers:**
- `FREE`: Basic access, limited features
- `BASIC`: Entry-level paid tier
- `PRO`: Full feature access
- `ENTERPRISE`: Custom plans for organizations

**Status:**
- `ACTIVE`: Subscription is active
- `TRIALING`: In trial period
- `PAST_DUE`: Payment failed but grace period active
- `CANCELED`: Subscription canceled
- `UNPAID`: Payment failed, access revoked

**Stripe Integration:**
- `stripeCustomerId`: Stripe customer ID
- `stripeSubscriptionId`: Stripe subscription ID
- `stripePriceId`: Stripe price ID
- `stripeCurrentPeriodEnd`: Current billing period end date

**Lifecycle:**
- `startDate`: Subscription start
- `endDate`: Subscription end (null for active)
- `trialEndsAt`: Trial period end
- `canceledAt`: Cancellation timestamp
- `cancelAtPeriodEnd`: Whether to cancel at period end

---

#### **invoices**
Billing invoices generated by Stripe.

**Fields:**
- `stripeInvoiceId`: Stripe invoice ID
- `amount`, `currency`: Invoice details
- `status`: DRAFT, OPEN, PAID, VOID, UNCOLLECTIBLE
- `invoiceDate`, `dueDate`, `paidAt`: Timestamps
- `invoiceUrl`, `invoicePdf`: Stripe-hosted URLs

---

#### **subscription_logs**
Audit log for subscription changes.

**Events:**
- `upgraded`: Tier upgrade
- `downgraded`: Tier downgrade
- `canceled`: Subscription canceled
- `renewed`: Auto-renewal processed
- `payment_failed`: Payment failure

---

### 4. Learning & Content System

#### **content**
All learning materials in the system.

**Types (ContentType ENUM):**
- `POST`: Blog posts from Sanity CMS
- `VIDEO`: Video tutorials (embedded or hosted)
- `PDF`: Downloadable documents
- `COURSE`: Multi-part courses
- `LINK`: External resources
- `PODCAST`: Audio content
- `TUTORIAL`: Step-by-step guides
- `DOCUMENTATION`: Reference documentation

**Sources (ContentSource ENUM):**
- `PLATFORM`: Created within the platform
- `SANITY`: From Sanity CMS (blog posts)
- `EXTERNAL`: Curated external links
- `USER_GENERATED`: User-created content

**Fields:**
- `title`, `slug`, `description`: Content metadata
- `url`, `thumbnailUrl`: Resource locations
- `duration`: Content length in minutes
- `difficulty`: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- `tags`, `topics`: Array of strings for categorization
- `isPremium`: Requires Pro subscription
- `isFeatured`: Featured content flag
- `viewCount`, `likeCount`: Engagement metrics

---

#### **learning_paths**
Curated learning journeys for users.

**Types:**
- System-generated paths based on onboarding quiz
- User-created custom paths
- Shared public paths (community-created)

**Fields:**
- `title`, `description`: Path metadata
- `status`: NOT_STARTED, IN_PROGRESS, COMPLETED, ARCHIVED
- `progress`: 0-100 completion percentage
- `isCustom`: User-created vs. system-generated
- `isPublic`: Visible to other users
- `estimatedHours`: Estimated completion time

---

#### **learning_path_items**
Individual content items within a learning path.

**Fields:**
- `order`: Display order in path
- `status`: NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED
- `isRequired`: Required vs. optional content
- `startedAt`, `completedAt`: Progress timestamps
- `estimatedMinutes`: Expected time to complete

---

#### **bookmarks**
User-saved content for later.

**Fields:**
- `note`: Optional note about why bookmarked
- `tags`: User-defined tags for organization

---

#### **notes**
User notes on content or standalone.

**Fields:**
- `contentId`: Optional link to content (null for standalone notes)
- `title`, `body`: Note content
- `tags`: Organization tags
- `isPrivate`: Visibility flag

---

#### **progress_tracking**
Detailed progress tracking for each user-content pair.

**Fields:**
- `progress`: 0-100 completion percentage
- `timeSpentMinutes`: Total time spent
- `lastPosition`: Last position in video/course (for resume)
- `completed`: Boolean completion flag
- `startedAt`, `completedAt`, `lastAccessedAt`: Timestamps

---

### 5. Gamification & Achievements

#### **achievements**
Predefined achievements users can unlock.

**Categories:**
- `learning`: Content completion milestones
- `streak`: Daily activity streaks
- `social`: Community engagement
- `mastery`: Skill level achievements

**Rarity Levels:**
- `COMMON`: Easy to achieve
- `UNCOMMON`: Moderate difficulty
- `RARE`: Challenging
- `EPIC`: Very difficult
- `LEGENDARY`: Extremely rare

**Fields:**
- `name` (unique): Achievement identifier
- `displayName`, `description`: User-facing text
- `icon`: Icon identifier
- `points`: Achievement points value
- `criteria`: JSON object defining unlock conditions

**Example Criteria:**
```json
{
  "type": "streak",
  "value": 7
}
```
```json
{
  "type": "completed_items",
  "value": 10,
  "difficulty": "ADVANCED"
}
```

---

#### **user_achievements**
Tracks unlocked achievements per user.

**Fields:**
- `unlockedAt`: When achievement was earned
- `progress`: Current progress toward achievement (0-100)

---

#### **certificates**
Certificates earned by completing courses/paths.

**Fields:**
- `title`, `description`: Certificate details
- `certificateUrl`: PDF certificate URL
- `verificationCode` (unique): Public verification code
- `issuedAt`, `expiresAt`: Validity period
- `metadata`: JSON with course details, instructor, etc.

---

### 6. Assessments & Quizzes

#### **quizzes**
Assessment questions for knowledge testing.

**Fields:**
- `title`, `description`: Quiz metadata
- `difficulty`: Difficulty level
- `timeLimit`: Time limit in minutes (optional)
- `passingScore`: Minimum score to pass (0-100)
- `questions`: JSON array of question objects
- `tags`: Topic categorization
- `isPremium`: Pro-only quizzes

**Question Schema (JSON):**
```json
{
  "id": "q1",
  "question": "What is React?",
  "type": "multiple_choice",
  "options": ["Library", "Framework", "Language", "Tool"],
  "correctAnswer": 0,
  "explanation": "React is a JavaScript library for building user interfaces."
}
```

---

#### **quiz_attempts**
User quiz attempts and results.

**Fields:**
- `answers`: JSON with user's answers
- `score`: Final score (0-100)
- `passed`: Pass/fail flag
- `timeSpent`: Time taken in seconds
- `startedAt`, `completedAt`: Timestamps

---

### 7. Analytics & Tracking

#### **activity_logs**
Comprehensive user activity tracking.

**Common Actions:**
- `view_content`: Content viewed
- `complete_item`: Learning item completed
- `bookmark_content`: Content bookmarked
- `create_note`: Note created
- `start_learning_path`: Learning path started
- `upgrade_subscription`: Subscription upgraded
- `unlock_achievement`: Achievement earned

**Fields:**
- `action`: Action type
- `resource`, `resourceId`: Target resource
- `metadata`: JSON with additional context
- `ipAddress`, `userAgent`: Request context

---

### 8. Notifications

#### **notification_preferences**
User notification preferences per channel.

**Channels:**
- **Email**: New content, learning reminders, weekly summary, promotions
- **In-App**: Achievements, recommendations, updates
- **Push**: Reminders, urgent notifications

---

#### **notifications**
In-app notifications for users.

**Types:**
- `INFO`: Informational messages
- `SUCCESS`: Success confirmations
- `WARNING`: Warning messages
- `ERROR`: Error alerts
- `ACHIEVEMENT`: Achievement unlocks
- `REMINDER`: Learning reminders
- `PROMOTION`: Promotional offers

**Fields:**
- `userId`: Target user (null for system-wide)
- `title`, `message`: Notification content
- `link`: Optional action link
- `isRead`, `readAt`: Read status
- `expiresAt`: Optional expiration

---

### 9. Feature Flags

#### **feature_flags**
Control feature rollouts and A/B testing.

**Fields:**
- `key` (unique): Feature identifier (e.g., "ai_chat_beta")
- `enabled`: Global enable/disable
- `rules`: JSON targeting rules
- `rolloutPercentage`: Gradual rollout (0-100)

**Example Rules:**
```json
{
  "audienceType": ["PRO_USER"],
  "roles": ["admin", "instructor"],
  "minVersion": "2.0.0"
}
```

---

## Indexes & Performance

### Critical Indexes

**users**
- `users.email` (unique)
- `users.isActive, users.isSuspended` (compound)

**user_profiles**
- `user_profiles.userId` (unique, foreign key)
- `user_profiles.audienceType`
- `user_profiles.experienceLevel`

**roles / permissions**
- `roles.name` (unique)
- `permissions.name` (unique)
- `permissions.resource, permissions.action` (compound)

**subscriptions**
- `subscriptions.userId` (unique)
- `subscriptions.stripeCustomerId` (unique)
- `subscriptions.status, subscriptions.tier` (compound)

**content**
- `content.slug` (unique)
- `content.type, content.isPublic` (compound)
- `content.isPremium, content.isFeatured` (compound)

**learning_paths**
- `learning_paths.userId`
- `learning_paths.status`

**activity_logs**
- `activity_logs.userId, activity_logs.createdAt` (compound)
- `activity_logs.action`

### Query Optimization Tips

1. **Use SELECT only needed fields** instead of `SELECT *`
2. **Batch queries** with Prisma's include/select
3. **Pagination**: Use cursor-based for large datasets
4. **Caching**: Redis for frequently accessed data (user sessions, feed)
5. **Connection pooling**: Configure Prisma connection pool

---

## Data Privacy & Security

### GDPR Compliance

1. **Data Export**
   - Provide user data in JSON format via API
   - Include all user-related tables

2. **Data Deletion**
   - Soft delete: Set `isActive = false`, `isSuspended = true`
   - Hard delete: Remove all user data (cascade deletes configured)

3. **Consent Management**
   - `allowAnalytics`, `allowMarketing` flags in profile
   - Notification preferences table

### Security Measures

1. **Password Hashing**: bcrypt with salt rounds ≥ 10
2. **SQL Injection**: Prisma ORM prevents injection by default
3. **Access Control**: Middleware checks for route protection
4. **Rate Limiting**: Implement at API level with Redis
5. **Audit Logging**: Activity logs for sensitive operations

---

## Migration Strategy

### Phase 1: Foundation (Week 1)
```bash
# Initialize Prisma
npx prisma init

# Create initial migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

**Tables:**
- users, accounts, sessions, verification_tokens (NextAuth)
- user_profiles
- roles, permissions, user_roles, role_permissions

### Phase 2: Core Features (Week 2)
**Tables:**
- content, bookmarks, notes
- learning_paths, learning_path_items
- progress_tracking

### Phase 3: Monetization (Week 3)
**Tables:**
- subscriptions, invoices, subscription_logs

### Phase 4: Gamification (Week 4)
**Tables:**
- achievements, user_achievements, certificates
- quizzes, quiz_attempts

### Phase 5: Analytics (Week 5)
**Tables:**
- activity_logs
- notifications, notification_preferences
- feature_flags

### Seeding Strategy

**Seed system data:**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create system roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      displayName: 'Administrator',
      priority: 100,
      isSystem: true,
    },
  });

  // Create permissions
  const permissions = [
    { name: 'user:read', resource: 'user', action: 'read' },
    { name: 'user:create', resource: 'user', action: 'create' },
    // ... more permissions
  ];

  await prisma.permission.createMany({ data: permissions });
  
  // Link permissions to roles
  // ... role_permissions setup
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## API Integration Examples

### Create User Profile
```typescript
// app/api/profile/route.ts
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  const data = await req.json();
  
  const profile = await prisma.userProfile.create({
    data: {
      userId: session.user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      experienceLevel: data.experienceLevel,
      // ... other fields
    },
  });

  return Response.json({ success: true, data: profile });
}
```

### Check User Permissions
```typescript
// lib/auth/permissions.ts
import { prisma } from '@/lib/prisma';

export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  // Check direct user permissions
  const userPerm = await prisma.userPermission.findFirst({
    where: {
      userId,
      permission: {
        resource,
        action,
      },
    },
  });

  if (userPerm) return true;

  // Check role permissions
  const rolePerm = await prisma.userRole.findFirst({
    where: {
      userId,
      role: {
        permissions: {
          some: {
            permission: {
              resource,
              action,
            },
          },
        },
      },
    },
  });

  return !!rolePerm;
}
```

---

## Conclusion

This database design provides a robust, scalable foundation for the Frontendpedia SaaS platform. Key benefits:

✅ **Extensible**: Easy to add new fields, relationships, and features  
✅ **Flexible**: Support for multiple user types, roles, and permissions  
✅ **Performant**: Proper indexing and query optimization  
✅ **Secure**: RBAC, audit logging, GDPR compliance  
✅ **Maintainable**: Clear separation of concerns and well-documented  

For questions or suggestions, refer to the Prisma schema file at `platform-saas-main/prisma/schema.prisma`.
