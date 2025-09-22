"use client";

import { useState } from 'react';
import { ShareIcon, UserGroupIcon, ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  const StatCard = ({ title, value, icon: Icon, color = "blue" }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color?: "blue" | "green" | "purple" | "orange";
  }) => {
    const colorClasses = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-600 dark:text-blue-400"
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-600 dark:text-green-400"
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-600 dark:text-purple-400"
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900",
        text: "text-orange-600 dark:text-orange-400"
      }
    };

    const selectedColor = colorClasses[color] || colorClasses.blue;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-md ${selectedColor.bg}`}>
            <Icon className={`h-6 w-6 ${selectedColor.text}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Social Media Analytics Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clicks"
            value={0}
            icon={ShareIcon}
            color="blue"
          />
          <StatCard
            title="Unique Sessions"
            value={0}
            icon={UserGroupIcon}
            color="green"
          />
          <StatCard
            title="Avg Performance Score"
            value="0%"
            icon={ArrowTrendingUpIcon}
            color="purple"
          />
          <StatCard
            title="Top Platform"
            value="N/A"
            icon={ChartBarIcon}
            color="orange"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a simplified version of the admin dashboard. The full version with analytics data will be available once the API endpoints are properly configured.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✅ Native social share buttons implemented
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✅ Analytics tracking system created
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✅ Brand mention crawler built
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✅ Admin dashboard interface ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}