/**
 * User Profile Type Definitions
 * 
 * This file contains TypeScript interfaces and types for the user profile system.
 * These types are designed to be extensible and align with the Prisma schema.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum LearningStyle {
  VISUAL = 'VISUAL',
  READING = 'READING',
  HANDS_ON = 'HANDS_ON',
  VIDEO = 'VIDEO',
  MIXED = 'MIXED',
}

export enum AudienceType {
  FREE_USER = 'FREE_USER',
  PRO_USER = 'PRO_USER',
  TRIAL_USER = 'TRIAL_USER',
  ENTERPRISE_USER = 'ENTERPRISE_USER',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  INCOMPLETE = 'INCOMPLETE',
  TRIALING = 'TRIALING',
}

// ============================================================================
// CORE USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  emailVerified?: Date | null;
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  isActive: boolean;
  isSuspended: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  bio?: string | null;
  avatar?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  country?: string | null;
  city?: string | null;
  timezone: string;
  language: string;

  // Professional Information
  jobTitle?: string | null;
  company?: string | null;
  yearsExperience: number;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;

  // Learning Profile
  experienceLevel: ExperienceLevel;
  learningGoals: string[];
  interests: string[];
  skillLevel?: Record<string, number> | null;
  preferredLearningStyle: LearningStyle;
  weeklyLearningHours: number;

  // Audience Segmentation
  audienceType: AudienceType;
  domain?: string | null;
  industry?: string | null;

  // Tracking & Analytics
  totalLearningMinutes: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate?: Date | null;
  onboardingCompleted: boolean;
  onboardingStep: number;

  // Privacy & Communication
  isProfilePublic: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
}

// ============================================================================
// ROLE & PERMISSION TYPES
// ============================================================================

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  priority: number;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  resource: string;
  action: string;
  isSystem: boolean;
  createdAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy?: string | null;
  expiresAt?: Date | null;
  role?: Role;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  grantedAt: Date;
  grantedBy?: string | null;
  expiresAt?: Date | null;
  permission?: Permission;
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeCurrentPeriodEnd?: Date | null;
  billingCycle?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | null;
  amount?: number | null;
  currency: string;
  startDate: Date;
  endDate?: Date | null;
  trialEndsAt?: Date | null;
  canceledAt?: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FULL USER PROFILE WITH RELATIONS
// ============================================================================

export interface FullUserProfile extends User {
  profile?: UserProfile | null;
  roles: UserRole[];
  permissions: UserPermission[];
  subscription?: Subscription | null;
}

// ============================================================================
// DTO (Data Transfer Objects) - For API Requests/Responses
// ============================================================================

export interface CreateUserProfileDTO {
  // Personal Information
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date string
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;

  // Professional Information
  jobTitle?: string;
  company?: string;
  yearsExperience?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;

  // Learning Profile
  experienceLevel?: ExperienceLevel;
  learningGoals?: string[];
  interests?: string[];
  preferredLearningStyle?: LearningStyle;
  weeklyLearningHours?: number;

  // Audience Segmentation
  domain?: string;
  industry?: string;
}

export interface UpdateUserProfileDTO extends Partial<CreateUserProfileDTO> {
  // All fields are optional for updates
}

export interface UserProfileResponse {
  success: boolean;
  data?: FullUserProfile;
  error?: string;
  message?: string;
}

// ============================================================================
// AUTHORIZATION HELPERS
// ============================================================================

export interface UserPermissions {
  roles: string[]; // Role names
  permissions: string[]; // Permission names
  canAccess: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
  isAdmin: boolean;
  isPro: boolean;
  isFree: boolean;
}

export interface AccessControlContext {
  userId: string;
  roles: Role[];
  permissions: Permission[];
  subscription?: Subscription;
}

// ============================================================================
// ONBOARDING TYPES
// ============================================================================

export interface OnboardingStepData {
  step: number;
  completed: boolean;
  data?: Record<string, any>;
}

export interface OnboardingQuizAnswer {
  question: string;
  answer: string | string[];
}

export interface OnboardingResult {
  experienceLevel: ExperienceLevel;
  interests: string[];
  learningGoals: string[];
  preferredLearningStyle: LearningStyle;
  weeklyLearningHours: number;
  recommendedContent: string[];
}

// ============================================================================
// TRACKING & ANALYTICS TYPES
// ============================================================================

export interface LearningMetrics {
  totalLearningMinutes: number;
  streakDays: number;
  longestStreak: number;
  completedItems: number;
  inProgressItems: number;
  bookmarksCount: number;
  achievementsCount: number;
  certificatesCount: number;
}

export interface ActivityMetrics {
  dailyActiveMinutes: number;
  weeklyActiveMinutes: number;
  monthlyActiveMinutes: number;
  lastActiveDate?: Date;
  averageSessionDuration: number;
}

// ============================================================================
// PROFILE SETTINGS TYPES
// ============================================================================

export interface PrivacySettings {
  isProfilePublic: boolean;
  showEmail: boolean;
  showSocialLinks: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
}

export interface NotificationSettings {
  emailNewContent: boolean;
  emailLearningReminder: boolean;
  emailWeeklySummary: boolean;
  emailPromotions: boolean;
  inAppAchievements: boolean;
  inAppRecommendations: boolean;
  inAppUpdates: boolean;
  pushEnabled: boolean;
  pushReminders: boolean;
}

export interface ProfileSettings {
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  language: string;
  timezone: string;
}

// ============================================================================
// VALIDATION SCHEMAS (For runtime validation)
// ============================================================================

export const ExperienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.BEGINNER]: 'Beginner',
  [ExperienceLevel.INTERMEDIATE]: 'Intermediate',
  [ExperienceLevel.ADVANCED]: 'Advanced',
  [ExperienceLevel.EXPERT]: 'Expert',
};

export const LearningStyleLabels: Record<LearningStyle, string> = {
  [LearningStyle.VISUAL]: 'Visual Learning',
  [LearningStyle.READING]: 'Reading & Writing',
  [LearningStyle.HANDS_ON]: 'Hands-on Practice',
  [LearningStyle.VIDEO]: 'Video Tutorials',
  [LearningStyle.MIXED]: 'Mixed Approach',
};

export const AudienceTypeLabels: Record<AudienceType, string> = {
  [AudienceType.FREE_USER]: 'Free User',
  [AudienceType.PRO_USER]: 'Pro User',
  [AudienceType.TRIAL_USER]: 'Trial User',
  [AudienceType.ENTERPRISE_USER]: 'Enterprise User',
  [AudienceType.STUDENT]: 'Student',
  [AudienceType.INSTRUCTOR]: 'Instructor',
  [AudienceType.ADMIN]: 'Administrator',
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ProfileUpdatePayload = Partial<UserProfile>;

export type ProfileSection = 
  | 'personal' 
  | 'professional' 
  | 'learning' 
  | 'privacy' 
  | 'notifications';

export interface ProfileCompleteness {
  overall: number; // 0-100
  sections: Record<ProfileSection, number>;
  missingFields: string[];
  suggestions: string[];
}
