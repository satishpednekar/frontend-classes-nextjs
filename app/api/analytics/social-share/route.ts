import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// In-memory storage for demo purposes
// In production, use a proper database like PostgreSQL, MongoDB, or Redis
let analyticsData: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = headers();
    
    // Get additional request data
    const ip = request.ip || 
               headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    const userAgent = headersList.get('user-agent') || 'unknown';
    const referer = headersList.get('referer') || 'unknown';
    const acceptLanguage = headersList.get('accept-language') || 'unknown';
    
    // Enhanced analytics data
    const enhancedData = {
      ...body,
      id: crypto.randomUUID(),
      ip,
      userAgent,
      referer,
      acceptLanguage,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      hour: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      // Extract country from IP (simplified - in production use a proper geolocation service)
      country: getCountryFromIP(ip),
      // Device detection from user agent
      device: getDeviceInfo(userAgent),
      browser: getBrowserInfo(userAgent),
      os: getOSInfo(userAgent),
      // Performance metrics
      performanceScore: calculatePerformanceScore(body),
      // Session data
      sessionId: getSessionId(request),
      // Page data
      pagePath: new URL(body.url || '').pathname,
      pageDomain: new URL(body.url || '').hostname,
    };

    // Store the analytics data
    analyticsData.push(enhancedData);

    // In production, save to database here
    // await saveToDatabase(enhancedData);

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics data recorded',
      id: enhancedData.id 
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const action = searchParams.get('action');

    let filteredData = analyticsData;

    // Apply filters
    if (platform) {
      filteredData = filteredData.filter(item => item.platform === platform);
    }
    
    if (action) {
      filteredData = filteredData.filter(item => item.action === action);
    }

    if (startDate) {
      filteredData = filteredData.filter(item => item.date >= startDate);
    }

    if (endDate) {
      filteredData = filteredData.filter(item => item.date <= endDate);
    }

    // Calculate metrics
    const metrics = {
      totalClicks: filteredData.length,
      uniqueSessions: new Set(filteredData.map(item => item.sessionId)).size,
      platformBreakdown: getPlatformBreakdown(filteredData),
      countryBreakdown: getCountryBreakdown(filteredData),
      deviceBreakdown: getDeviceBreakdown(filteredData),
      hourlyDistribution: getHourlyDistribution(filteredData),
      dailyDistribution: getDailyDistribution(filteredData),
      topPages: getTopPages(filteredData),
      averagePerformanceScore: getAveragePerformanceScore(filteredData),
      recentActivity: filteredData.slice(-10).reverse()
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve analytics data' },
      { status: 500 }
    );
  }
}

// Helper functions
function getCountryFromIP(ip: string): string {
  // Simplified country detection - in production use a proper geolocation service
  if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
    return 'Local';
  }
  // This is a placeholder - implement proper IP geolocation
  return 'Unknown';
}

function getDeviceInfo(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    return 'Mobile';
  }
  if (/Tablet|iPad/.test(userAgent)) {
    return 'Tablet';
  }
  return 'Desktop';
}

function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

function getOSInfo(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Other';
}

function calculatePerformanceScore(data: any): number {
  // Calculate a performance score based on available hardware data
  let score = 50; // Base score
  
  if (data.deviceMemory && data.deviceMemory !== 'unknown') {
    score += Math.min(data.deviceMemory * 5, 20); // Up to 20 points for memory
  }
  
  if (data.hardwareConcurrency && data.hardwareConcurrency !== 'unknown') {
    score += Math.min(data.hardwareConcurrency * 3, 15); // Up to 15 points for CPU cores
  }
  
  if (data.connectionType && data.connectionType !== 'unknown') {
    const connectionScores = {
      'slow-2g': 5,
      '2g': 10,
      '3g': 20,
      '4g': 30
    };
    score += connectionScores[data.connectionType] || 15;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function getSessionId(request: NextRequest): string {
  // Generate a session ID based on IP and user agent
  const ip = request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return btoa(ip + userAgent).substring(0, 16);
}

function getPlatformBreakdown(data: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  data.forEach(item => {
    breakdown[item.platform] = (breakdown[item.platform] || 0) + 1;
  });
  return breakdown;
}

function getCountryBreakdown(data: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  data.forEach(item => {
    breakdown[item.country] = (breakdown[item.country] || 0) + 1;
  });
  return breakdown;
}

function getDeviceBreakdown(data: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  data.forEach(item => {
    breakdown[item.device] = (breakdown[item.device] || 0) + 1;
  });
  return breakdown;
}

function getHourlyDistribution(data: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  data.forEach(item => {
    const hour = item.hour.toString().padStart(2, '0');
    distribution[hour] = (distribution[hour] || 0) + 1;
  });
  return distribution;
}

function getDailyDistribution(data: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  data.forEach(item => {
    distribution[item.date] = (distribution[item.date] || 0) + 1;
  });
  return distribution;
}

function getTopPages(data: any[]): Array<{page: string, count: number}> {
  const pageCounts: Record<string, number> = {};
  data.forEach(item => {
    pageCounts[item.pagePath] = (pageCounts[item.pagePath] || 0) + 1;
  });
  
  return Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getAveragePerformanceScore(data: any[]): number {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, item) => sum + (item.performanceScore || 0), 0);
  return Math.round(total / data.length);
}
