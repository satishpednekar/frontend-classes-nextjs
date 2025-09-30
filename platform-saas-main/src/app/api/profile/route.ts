/**
 * User Profile API Routes
 * 
 * GET /api/profile - Get current user's profile
 * POST /api/profile - Create user profile
 * PUT /api/profile - Update user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { CreateUserProfileDTO, UpdateUserProfileDTO } from '@/types/user-profile';

/**
 * GET /api/profile
 * Get the current user's complete profile with relations
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user by email from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        roles: {
          include: {
            role: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile
 * Create a new user profile (called after signup/onboarding)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists' },
        { status: 400 }
      );
    }

    const data: CreateUserProfileDTO = await req.json();

    // Create profile
    const profile = await prisma.userProfile.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        bio: data.bio,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        country: data.country,
        city: data.city,
        timezone: data.timezone || 'UTC',
        language: data.language || 'en',
        jobTitle: data.jobTitle,
        company: data.company,
        yearsExperience: data.yearsExperience || 0,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        websiteUrl: data.websiteUrl,
        experienceLevel: data.experienceLevel || 'BEGINNER',
        learningGoals: data.learningGoals || [],
        interests: data.interests || [],
        preferredLearningStyle: data.preferredLearningStyle || 'MIXED',
        weeklyLearningHours: data.weeklyLearningHours || 5,
        domain: data.domain,
        industry: data.industry,
      },
    });

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Profile created successfully',
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const data: UpdateUserProfileDTO = await req.json();

    // Prepare update data (only include defined fields)
    const updateData: any = {};
    
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    }
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.yearsExperience !== undefined) updateData.yearsExperience = data.yearsExperience;
    if (data.linkedinUrl !== undefined) updateData.linkedinUrl = data.linkedinUrl;
    if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
    if (data.portfolioUrl !== undefined) updateData.portfolioUrl = data.portfolioUrl;
    if (data.websiteUrl !== undefined) updateData.websiteUrl = data.websiteUrl;
    if (data.experienceLevel !== undefined) updateData.experienceLevel = data.experienceLevel;
    if (data.learningGoals !== undefined) updateData.learningGoals = data.learningGoals;
    if (data.interests !== undefined) updateData.interests = data.interests;
    if (data.preferredLearningStyle !== undefined) {
      updateData.preferredLearningStyle = data.preferredLearningStyle;
    }
    if (data.weeklyLearningHours !== undefined) {
      updateData.weeklyLearningHours = data.weeklyLearningHours;
    }
    if (data.domain !== undefined) updateData.domain = data.domain;
    if (data.industry !== undefined) updateData.industry = data.industry;

    // Update profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
