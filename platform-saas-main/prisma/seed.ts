/**
 * Prisma Database Seed Script
 * 
 * This script populates the database with initial data:
 * - System roles (admin, pro_user, free_user, instructor, moderator)
 * - System permissions (resource:action format)
 * - Default role-permission mappings
 * - Sample achievements
 * - Feature flags
 * 
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // 1. Create System Roles
  // ============================================================================
  console.log('📝 Creating system roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access with all permissions',
      priority: 100,
      isSystem: true,
    },
  });

  const instructorRole = await prisma.role.upsert({
    where: { name: 'instructor' },
    update: {},
    create: {
      name: 'instructor',
      displayName: 'Instructor',
      description: 'Can create and manage learning content',
      priority: 50,
      isSystem: true,
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      displayName: 'Moderator',
      description: 'Can moderate user content and comments',
      priority: 40,
      isSystem: true,
    },
  });

  const proUserRole = await prisma.role.upsert({
    where: { name: 'pro_user' },
    update: {},
    create: {
      name: 'pro_user',
      displayName: 'Pro User',
      description: 'Access to premium features and content',
      priority: 20,
      isSystem: true,
    },
  });

  const freeUserRole = await prisma.role.upsert({
    where: { name: 'free_user' },
    update: {},
    create: {
      name: 'free_user',
      displayName: 'Free User',
      description: 'Basic platform access',
      priority: 10,
      isSystem: true,
    },
  });

  console.log(`✅ Created ${5} system roles`);

  // ============================================================================
  // 2. Create System Permissions
  // ============================================================================
  console.log('📝 Creating system permissions...');

  const permissions = [
    // User permissions
    { name: 'user:read', resource: 'user', action: 'read', displayName: 'View Users' },
    { name: 'user:create', resource: 'user', action: 'create', displayName: 'Create Users' },
    { name: 'user:update', resource: 'user', action: 'update', displayName: 'Update Users' },
    { name: 'user:delete', resource: 'user', action: 'delete', displayName: 'Delete Users' },
    { name: 'user:manage', resource: 'user', action: 'manage', displayName: 'Manage All Users' },

    // Content permissions
    { name: 'content:read', resource: 'content', action: 'read', displayName: 'View Content' },
    { name: 'content:create', resource: 'content', action: 'create', displayName: 'Create Content' },
    { name: 'content:update', resource: 'content', action: 'update', displayName: 'Update Content' },
    { name: 'content:delete', resource: 'content', action: 'delete', displayName: 'Delete Content' },
    { name: 'content:publish', resource: 'content', action: 'publish', displayName: 'Publish Content' },
    { name: 'content:moderate', resource: 'content', action: 'moderate', displayName: 'Moderate Content' },

    // Subscription permissions
    { name: 'subscription:read', resource: 'subscription', action: 'read', displayName: 'View Subscriptions' },
    { name: 'subscription:manage', resource: 'subscription', action: 'manage', displayName: 'Manage Subscriptions' },

    // Admin permissions
    { name: 'admin:dashboard', resource: 'admin', action: 'dashboard', displayName: 'Access Admin Dashboard' },
    { name: 'admin:analytics', resource: 'admin', action: 'analytics', displayName: 'View Analytics' },
    { name: 'admin:users', resource: 'admin', action: 'users', displayName: 'Manage Users (Admin)' },
    { name: 'admin:settings', resource: 'admin', action: 'settings', displayName: 'Manage System Settings' },

    // Learning path permissions
    { name: 'learning_path:create', resource: 'learning_path', action: 'create', displayName: 'Create Learning Paths' },
    { name: 'learning_path:update', resource: 'learning_path', action: 'update', displayName: 'Update Learning Paths' },
    { name: 'learning_path:delete', resource: 'learning_path', action: 'delete', displayName: 'Delete Learning Paths' },
    { name: 'learning_path:share', resource: 'learning_path', action: 'share', displayName: 'Share Learning Paths' },

    // Premium content access
    { name: 'premium:access', resource: 'premium', action: 'access', displayName: 'Access Premium Content' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: {
        ...perm,
        isSystem: true,
      },
    });
  }

  console.log(`✅ Created ${permissions.length} system permissions`);

  // ============================================================================
  // 3. Assign Permissions to Roles
  // ============================================================================
  console.log('📝 Assigning permissions to roles...');

  // Admin gets all permissions
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Instructor permissions
  const instructorPerms = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'content:read',
          'content:create',
          'content:update',
          'content:delete',
          'content:publish',
          'learning_path:create',
          'learning_path:update',
          'learning_path:share',
        ],
      },
    },
  });

  for (const permission of instructorPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: instructorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: instructorRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Moderator permissions
  const moderatorPerms = await prisma.permission.findMany({
    where: {
      name: {
        in: ['content:read', 'content:moderate', 'user:read'],
      },
    },
  });

  for (const permission of moderatorPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: moderatorRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Pro User permissions
  const proUserPerms = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'content:read',
          'premium:access',
          'learning_path:create',
          'learning_path:update',
          'learning_path:share',
        ],
      },
    },
  });

  for (const permission of proUserPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: proUserRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: proUserRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Free User permissions
  const freeUserPerms = await prisma.permission.findMany({
    where: {
      name: {
        in: ['content:read', 'learning_path:create', 'learning_path:update'],
      },
    },
  });

  for (const permission of freeUserPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: freeUserRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: freeUserRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(`✅ Assigned permissions to all roles`);

  // ============================================================================
  // 4. Create Sample Achievements
  // ============================================================================
  console.log('📝 Creating sample achievements...');

  const achievements = [
    {
      name: 'first_login',
      displayName: 'Welcome Aboard!',
      description: 'Complete your first login to the platform',
      icon: '👋',
      category: 'onboarding',
      points: 10,
      rarity: 'COMMON',
      criteria: { type: 'first_login' },
    },
    {
      name: 'profile_complete',
      displayName: 'Profile Master',
      description: 'Complete 100% of your profile',
      icon: '✨',
      category: 'profile',
      points: 20,
      rarity: 'COMMON',
      criteria: { type: 'profile_completeness', value: 100 },
    },
    {
      name: 'streak_7',
      displayName: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'streak',
      points: 50,
      rarity: 'UNCOMMON',
      criteria: { type: 'streak', value: 7 },
    },
    {
      name: 'streak_30',
      displayName: 'Month Master',
      description: 'Maintain a 30-day learning streak',
      icon: '💪',
      category: 'streak',
      points: 200,
      rarity: 'RARE',
      criteria: { type: 'streak', value: 30 },
    },
    {
      name: 'completed_10',
      displayName: 'Learning Enthusiast',
      description: 'Complete 10 learning items',
      icon: '📚',
      category: 'learning',
      points: 100,
      rarity: 'UNCOMMON',
      criteria: { type: 'completed_items', value: 10 },
    },
    {
      name: 'completed_50',
      displayName: 'Knowledge Seeker',
      description: 'Complete 50 learning items',
      icon: '🎓',
      category: 'learning',
      points: 500,
      rarity: 'EPIC',
      criteria: { type: 'completed_items', value: 50 },
    },
    {
      name: 'path_completed',
      displayName: 'Path Walker',
      description: 'Complete your first learning path',
      icon: '🛤️',
      category: 'learning',
      points: 150,
      rarity: 'UNCOMMON',
      criteria: { type: 'path_completed', value: 1 },
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement as any,
    });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // ============================================================================
  // 5. Create Feature Flags
  // ============================================================================
  console.log('📝 Creating feature flags...');

  const featureFlags = [
    {
      key: 'ai_chat',
      name: 'AI Chat Assistant',
      description: 'Enable AI-powered chat assistant for learning support',
      enabled: false,
      rules: { audienceType: ['PRO_USER', 'ADMIN'] },
      rolloutPercentage: 0,
    },
    {
      key: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Enable advanced analytics dashboard for users',
      enabled: true,
      rules: { audienceType: ['PRO_USER', 'ENTERPRISE_USER', 'ADMIN'] },
      rolloutPercentage: 100,
    },
    {
      key: 'social_sharing',
      name: 'Social Sharing',
      description: 'Enable social sharing of learning achievements',
      enabled: true,
      rules: {},
      rolloutPercentage: 100,
    },
    {
      key: 'certificates',
      name: 'Certificates',
      description: 'Enable certificate generation for completed paths',
      enabled: true,
      rules: { audienceType: ['PRO_USER', 'ENTERPRISE_USER'] },
      rolloutPercentage: 100,
    },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag as any,
    });
  }

  console.log(`✅ Created ${featureFlags.length} feature flags`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
