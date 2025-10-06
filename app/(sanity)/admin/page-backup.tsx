"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  ChartBarIcon,
  ShareIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalClicks: number;
  uniqueSessions: number;
  platformBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  dailyDistribution: Record<string, number>;
  topPages: Array<{page: string, count: number}>;
  averagePerformanceScore: number;
  recentActivity: Array<any>;
}

interface BrandMentionData {
  totalMentions: number;
  platformBreakdown: Record<string, number>;
  sentimentBreakdown: Record<string, number>;
  totalReach: number;
  totalEngagement: number;
  averageReach: number;
  averageEngagement: number;
  verifiedMentions: number;
  recentMentions: Array<any>;
  topPlatforms: Array<{platform: string, count: number, reach: number, engagement: number}>;
  sentimentTrend: Record<string, Record<string, number>>;
}

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [brandMentionData, setBrandMentionData] = useState<BrandMentionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'mentions'>('analytics');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      
      const response = await fetch(`/api/analytics/social-share?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const fetchBrandMentionData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      
      const response = await fetch(`/api/analytics/brand-mentions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch brand mention data');
      }
      
      const data = await response.json();
      setBrandMentionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const startCrawl = async () => {
    try {
      const response = await fetch('/api/analytics/crawl-mentions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [
            'https://twitter.com/search?q=frontendpedia',
            'https://www.reddit.com/search?q=frontendpedia',
            'https://medium.com/search?q=frontendpedia',
            'https://dev.to/search?q=frontendpedia'
          ],
          maxPages: 20
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start crawl');
      }
      
      alert('Brand mention crawl started! Check back in a few minutes.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start crawl');
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    } else {
      fetchBrandMentionData();
    }
  }, [activeTab, fetchAnalyticsData, fetchBrandMentionData]);

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

  const ChartCard = ({ title, children, className = "" }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
        {children}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading analytics
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchAnalyticsData}
                    className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Social Media Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track social media engagement and user behavior
          </p>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <ShareIcon className="w-5 h-5 inline mr-2" />
                Social Analytics
              </button>
              <button
                onClick={() => setActiveTab('mentions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mentions'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
                Brand Mentions
              </button>
            </nav>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Date Range</h3>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAnalyticsData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeTab === 'analytics' ? (
            <>
              <StatCard
                title="Total Clicks"
                value={analyticsData?.totalClicks || 0}
                icon={ShareIcon}
                color="blue"
              />
              <StatCard
                title="Unique Sessions"
                value={analyticsData?.uniqueSessions || 0}
                icon={UserGroupIcon}
                color="green"
              />
              <StatCard
                title="Avg Performance Score"
                value={`${analyticsData?.averagePerformanceScore || 0}%`}
                icon={ArrowTrendingUpIcon}
                color="purple"
              />
              <StatCard
                title="Top Platform"
                value={Object.keys(analyticsData?.platformBreakdown || {})[0] || 'N/A'}
                icon={ChartBarIcon}
                color="orange"
              />
            </>
          ) : (
            <>
              <StatCard
                title="Total Mentions"
                value={brandMentionData?.totalMentions || 0}
                icon={ChatBubbleLeftRightIcon}
                color="blue"
              />
              <StatCard
                title="Total Reach"
                value={brandMentionData?.totalReach?.toLocaleString() || '0'}
                icon={EyeIcon}
                color="green"
              />
              <StatCard
                title="Verified Mentions"
                value={brandMentionData?.verifiedMentions || 0}
                icon={HeartIcon}
                color="purple"
              />
              <StatCard
                title="Avg Engagement"
                value={brandMentionData?.averageEngagement || 0}
                icon={ArrowTrendingUpIcon}
                color="orange"
              />
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Platform Breakdown */}
          <ChartCard title={activeTab === 'analytics' ? "Platform Breakdown" : "Mention Platforms"}>
            <div className="space-y-3">
              {Object.entries(
                activeTab === 'analytics' 
                  ? analyticsData?.platformBreakdown || {}
                  : brandMentionData?.platformBreakdown || {}
              ).map(([platform, count]) => {
                const numCount = Number(count);
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {platform}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(numCount / (activeTab === 'analytics' 
                              ? (analyticsData?.totalClicks || 1)
                              : (brandMentionData?.totalMentions || 1)
                            )) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                        {numCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Device Breakdown / Sentiment Analysis */}
          <ChartCard title={activeTab === 'analytics' ? "Device Breakdown" : "Sentiment Analysis"}>
            <div className="space-y-3">
              {Object.entries(
                activeTab === 'analytics' 
                  ? analyticsData?.deviceBreakdown || {}
                  : brandMentionData?.sentimentBreakdown || {}
              ).map(([item, count]) => {
                const numCount = Number(count);
                return (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {item}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            activeTab === 'analytics' 
                              ? 'bg-green-600'
                              : item === 'positive' 
                                ? 'bg-green-600' 
                                : item === 'negative' 
                                  ? 'bg-red-600' 
                                  : 'bg-yellow-600'
                          }`}
                          style={{
                            width: `${(numCount / (activeTab === 'analytics' 
                              ? (analyticsData?.totalClicks || 1)
                              : (brandMentionData?.totalMentions || 1)
                            )) * 100}%`
                          }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                      {numCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Brand Mentions Crawl Section */}
        {activeTab === 'mentions' && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Brand Mention Crawler
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Search for brand mentions across social media platforms and websites.
            </p>
            <button
              onClick={startCrawl}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <MagnifyingGlassIcon className="w-4 h-4 inline mr-2" />
              Start Brand Mention Crawl
            </button>
          </div>
        )}

        {/* Recent Activity */}
        <ChartCard title={activeTab === 'analytics' ? "Recent Activity" : "Recent Mentions"} className="col-span-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {activeTab === 'analytics' ? 'Action' : 'Author'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {activeTab === 'analytics' ? 'Page' : 'Content'}
                  </th>
                  {activeTab === 'analytics' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Device
                    </th>
                  )}
                  {activeTab === 'mentions' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sentiment
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(activeTab === 'analytics' ? analyticsData?.recentActivity : brandMentionData?.recentMentions)?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {item.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                      {activeTab === 'analytics' ? item.action : item.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {activeTab === 'analytics' ? item.pagePath : item.content?.substring(0, 100) + '...'}
                    </td>
                    {activeTab === 'analytics' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                        {item.device}
                      </td>
                    )}
                    {activeTab === 'mentions' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.sentiment === 'positive' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : item.sentiment === 'negative'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {item.sentiment}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
