'use client';

import React, { useState } from 'react';
import {
  UserProfile,
  ExperienceLevel,
  LearningStyle,
  AudienceType,
  ExperienceLevelLabels,
  LearningStyleLabels,
  UpdateUserProfileDTO,
} from '@/types/user-profile';

interface UserProfileFormProps {
  profile: UserProfile | null;
  onSave: (data: UpdateUserProfileDTO) => Promise<void>;
  isLoading?: boolean;
}

export default function UserProfileForm({
  profile,
  onSave,
  isLoading = false,
}: UserProfileFormProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'learning' | 'privacy'>('personal');
  const [formData, setFormData] = useState<UpdateUserProfileDTO>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
    phoneNumber: profile?.phoneNumber || '',
    country: profile?.country || '',
    city: profile?.city || '',
    timezone: profile?.timezone || 'UTC',
    language: profile?.language || 'en',
    jobTitle: profile?.jobTitle || '',
    company: profile?.company || '',
    yearsExperience: profile?.yearsExperience || 0,
    linkedinUrl: profile?.linkedinUrl || '',
    githubUrl: profile?.githubUrl || '',
    portfolioUrl: profile?.portfolioUrl || '',
    websiteUrl: profile?.websiteUrl || '',
    experienceLevel: profile?.experienceLevel || ExperienceLevel.BEGINNER,
    learningGoals: profile?.learningGoals || [],
    interests: profile?.interests || [],
    preferredLearningStyle: profile?.preferredLearningStyle || LearningStyle.MIXED,
    weeklyLearningHours: profile?.weeklyLearningHours || 5,
    domain: profile?.domain || '',
    industry: profile?.industry || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UpdateUserProfileDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'learningGoals' | 'interests', value: string) => {
    const items = value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'professional', label: 'Professional' },
    { id: 'learning', label: 'Learning Profile' },
    { id: 'privacy', label: 'Privacy & Settings' },
  ] as const;

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Tab Navigation */}
      <div className="border-b border-stroke dark:border-strokedark">
        <div className="flex flex-wrap gap-2 p-4 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6.5">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName || ''}
                onChange={(e) => handleChange('displayName', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="How you want to be called"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Bio
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="San Francisco"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Timezone
                </label>
                <select
                  value={formData.timezone || 'UTC'}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Dubai">Dubai</option>
                  <option value="Asia/Kolkata">India</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Professional Information Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Professional Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle || ''}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Frontend Developer"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.yearsExperience || 0}
                onChange={(e) => handleChange('yearsExperience', parseInt(e.target.value) || 0)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Portfolio URL
              </label>
              <input
                type="url"
                value={formData.portfolioUrl || ''}
                onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ''}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Domain
                </label>
                <input
                  type="text"
                  value={formData.domain || ''}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="e.g., frontend, fullstack"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="e.g., fintech, healthcare"
                />
              </div>
            </div>
          </div>
        )}

        {/* Learning Profile Tab */}
        {activeTab === 'learning' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Learning Profile
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel || ExperienceLevel.BEGINNER}
                onChange={(e) => handleChange('experienceLevel', e.target.value as ExperienceLevel)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                {Object.entries(ExperienceLevelLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Preferred Learning Style
              </label>
              <select
                value={formData.preferredLearningStyle || LearningStyle.MIXED}
                onChange={(e) => handleChange('preferredLearningStyle', e.target.value as LearningStyle)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                {Object.entries(LearningStyleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Weekly Learning Hours
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={formData.weeklyLearningHours || 5}
                onChange={(e) => handleChange('weeklyLearningHours', parseInt(e.target.value) || 5)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              />
              <p className="mt-1 text-sm text-body dark:text-bodydark">
                How many hours per week can you dedicate to learning?
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Learning Goals
              </label>
              <input
                type="text"
                value={formData.learningGoals?.join(', ') || ''}
                onChange={(e) => handleArrayChange('learningGoals', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="e.g., Master React, Learn TypeScript, Build Portfolio"
              />
              <p className="mt-1 text-sm text-body dark:text-bodydark">
                Separate goals with commas
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Interests & Topics
              </label>
              <input
                type="text"
                value={formData.interests?.join(', ') || ''}
                onChange={(e) => handleArrayChange('interests', e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="e.g., React, Vue, Node.js, UI/UX, Performance"
              />
              <p className="mt-1 text-sm text-body dark:text-bodydark">
                Separate interests with commas
              </p>
            </div>
          </div>
        )}

        {/* Privacy & Settings Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Privacy & Settings
            </h3>

            <div className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
              <p className="text-sm text-body dark:text-bodydark">
                Privacy settings are managed separately in the account settings page.
                This section will include options for profile visibility, analytics preferences,
                and communication settings.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-black dark:text-white">Public Profile</p>
                  <p className="text-sm text-body dark:text-bodydark">
                    Make your profile visible to other users
                  </p>
                </div>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={profile?.isProfilePublic}
                  />
                  <div className="h-6 w-11 rounded-full bg-stroke dark:bg-strokedark">
                    <div className="h-6 w-6 rounded-full bg-white shadow-sm transition"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-black dark:text-white">Analytics</p>
                  <p className="text-sm text-body dark:text-bodydark">
                    Help us improve by sharing usage data
                  </p>
                </div>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={profile?.allowAnalytics}
                  />
                  <div className="h-6 w-11 rounded-full bg-stroke dark:bg-strokedark">
                    <div className="h-6 w-6 rounded-full bg-white shadow-sm transition"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-black dark:text-white">Marketing Emails</p>
                  <p className="text-sm text-body dark:text-bodydark">
                    Receive updates about new features and content
                  </p>
                </div>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={profile?.allowMarketing}
                  />
                  <div className="h-6 w-11 rounded-full bg-stroke dark:bg-strokedark">
                    <div className="h-6 w-6 rounded-full bg-white shadow-sm transition"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-6 flex justify-end gap-4 border-t border-stroke pt-4 dark:border-strokedark">
          <button
            type="button"
            className="rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
