/**
 * Permission and Authorization Utilities
 * 
 * This module provides functions to check user permissions and roles.
 * It implements a flexible RBAC system with support for role-based and direct permissions.
 */

import { prisma } from '@/lib/prisma';
import { UserPermissions, AccessControlContext } from '@/types/user-profile';

/**
 * Get user's complete permission context
 */
export async function getUserPermissions(userId: string): Promise<UserPermissions> {
  const userWithRoles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        where: {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
      permissions: {
        where: {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        include: {
          permission: true,
        },
      },
      subscription: true,
    },
  });

  if (!userWithRoles) {
    throw new Error('User not found');
  }

  // Collect all role names
  const roles = userWithRoles.roles.map((ur) => ur.role.name);

  // Collect all permission names from roles and direct permissions
  const rolePermissions = userWithRoles.roles.flatMap((ur) =>
    ur.role.permissions.map((rp) => rp.permission.name)
  );
  const directPermissions = userWithRoles.permissions.map((up) => up.permission.name);
  const allPermissions = [...new Set([...rolePermissions, ...directPermissions])];

  // Helper functions
  const hasRole = (roleName: string) => roles.includes(roleName);
  
  const hasPermission = (permissionName: string) => allPermissions.includes(permissionName);
  
  const canAccess = (resource: string, action: string) => {
    const permissionName = `${resource}:${action}`;
    return allPermissions.includes(permissionName);
  };

  return {
    roles,
    permissions: allPermissions,
    canAccess,
    hasRole,
    hasPermission,
    isAdmin: hasRole('admin'),
    isPro: userWithRoles.subscription?.tier === 'PRO' || userWithRoles.subscription?.tier === 'ENTERPRISE',
    isFree: !userWithRoles.subscription || userWithRoles.subscription.tier === 'FREE',
  };
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const permissionName = `${resource}:${action}`;

  // Check direct user permissions
  const userPermission = await prisma.userPermission.findFirst({
    where: {
      userId,
      permission: {
        name: permissionName,
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  if (userPermission) return true;

  // Check role-based permissions
  const rolePermission = await prisma.userRole.findFirst({
    where: {
      userId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
      role: {
        permissions: {
          some: {
            permission: {
              name: permissionName,
            },
          },
        },
      },
    },
  });

  return !!rolePermission;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: {
        name: roleName,
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  return !!userRole;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'admin');
}

/**
 * Check if user has Pro subscription
 */
export async function isPro(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  return (
    subscription?.tier === 'PRO' ||
    subscription?.tier === 'ENTERPRISE'
  ) && subscription?.status === 'ACTIVE';
}

/**
 * Assign role to user
 */
export async function assignRole(
  userId: string,
  roleName: string,
  assignedBy?: string,
  expiresAt?: Date
) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role '${roleName}' not found`);
  }

  return prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    create: {
      userId,
      roleId: role.id,
      assignedBy,
      expiresAt,
    },
    update: {
      assignedBy,
      expiresAt,
    },
  });
}

/**
 * Remove role from user
 */
export async function removeRole(userId: string, roleName: string) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role '${roleName}' not found`);
  }

  return prisma.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
  });
}

/**
 * Grant direct permission to user
 */
export async function grantPermission(
  userId: string,
  permissionName: string,
  grantedBy?: string,
  expiresAt?: Date
) {
  const permission = await prisma.permission.findUnique({
    where: { name: permissionName },
  });

  if (!permission) {
    throw new Error(`Permission '${permissionName}' not found`);
  }

  return prisma.userPermission.upsert({
    where: {
      userId_permissionId: {
        userId,
        permissionId: permission.id,
      },
    },
    create: {
      userId,
      permissionId: permission.id,
      grantedBy,
      expiresAt,
    },
    update: {
      grantedBy,
      expiresAt,
    },
  });
}

/**
 * Revoke direct permission from user
 */
export async function revokePermission(userId: string, permissionName: string) {
  const permission = await prisma.permission.findUnique({
    where: { name: permissionName },
  });

  if (!permission) {
    throw new Error(`Permission '${permissionName}' not found`);
  }

  return prisma.userPermission.delete({
    where: {
      userId_permissionId: {
        userId,
        permissionId: permission.id,
      },
    },
  });
}
