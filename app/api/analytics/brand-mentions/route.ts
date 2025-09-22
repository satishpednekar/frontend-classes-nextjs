import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use a proper database
let brandMentions: Array<{
  id: string;
  url: string;
  title: string;
  content: string;
  platform: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reach: number;
  engagement: number;
  author: string;
  verified: boolean;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, content, platform, author, verified = false } = body;
    
    if (!url || !title || !content) {
      return NextResponse.json(
        { error: 'URL, title, and content are required' },
        { status: 400 }
      );
    }

    // Analyze sentiment (simplified)
    const sentiment = analyzeSentiment(content);
    
    // Calculate reach and engagement (simplified)
    const reach = Math.floor(Math.random() * 10000) + 100; // Mock data
    const engagement = Math.floor(Math.random() * 1000) + 10; // Mock data

    const mention = {
      id: crypto.randomUUID(),
      url,
      title,
      content,
      platform: platform || 'unknown',
      timestamp: new Date().toISOString(),
      sentiment,
      reach,
      engagement,
      author: author || 'Unknown',
      verified
    };

    // Check if mention already exists
    const existingMention = brandMentions.find(m => m.url === url);
    if (existingMention) {
      return NextResponse.json(
        { success: false, message: 'Mention already exists' },
        { status: 409 }
      );
    }

    brandMentions.push(mention);

    return NextResponse.json({ 
      success: true, 
      mention,
      message: 'Brand mention recorded'
    });

  } catch (error) {
    console.error('Brand mention tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to record brand mention' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const sentiment = searchParams.get('sentiment');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const verified = searchParams.get('verified');

    let filteredMentions = brandMentions;

    // Apply filters
    if (platform) {
      filteredMentions = filteredMentions.filter(mention => mention.platform === platform);
    }
    
    if (sentiment) {
      filteredMentions = filteredMentions.filter(mention => mention.sentiment === sentiment);
    }

    if (startDate) {
      filteredMentions = filteredMentions.filter(mention => mention.timestamp >= startDate);
    }

    if (endDate) {
      filteredMentions = filteredMentions.filter(mention => mention.timestamp <= endDate);
    }

    if (verified === 'true') {
      filteredMentions = filteredMentions.filter(mention => mention.verified);
    }

    // Calculate metrics
    const metrics = {
      totalMentions: filteredMentions.length,
      platformBreakdown: getPlatformBreakdown(filteredMentions),
      sentimentBreakdown: getSentimentBreakdown(filteredMentions),
      totalReach: filteredMentions.reduce((sum, mention) => sum + mention.reach, 0),
      totalEngagement: filteredMentions.reduce((sum, mention) => sum + mention.engagement, 0),
      averageReach: filteredMentions.length > 0 ? Math.round(filteredMentions.reduce((sum, mention) => sum + mention.reach, 0) / filteredMentions.length) : 0,
      averageEngagement: filteredMentions.length > 0 ? Math.round(filteredMentions.reduce((sum, mention) => sum + mention.engagement, 0) / filteredMentions.length) : 0,
      verifiedMentions: filteredMentions.filter(mention => mention.verified).length,
      recentMentions: filteredMentions.slice(-10).reverse(),
      topPlatforms: getTopPlatforms(filteredMentions),
      sentimentTrend: getSentimentTrend(filteredMentions)
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Brand mentions retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve brand mentions' },
      { status: 500 }
    );
  }
}

// Helper functions
function analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'awesome', 'fantastic', 'brilliant', 'outstanding', 'perfect', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointing', 'poor', 'worst', 'useless', 'garbage'];
  
  const lowerContent = content.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function getPlatformBreakdown(mentions: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  mentions.forEach(mention => {
    breakdown[mention.platform] = (breakdown[mention.platform] || 0) + 1;
  });
  return breakdown;
}

function getSentimentBreakdown(mentions: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  mentions.forEach(mention => {
    breakdown[mention.sentiment] = (breakdown[mention.sentiment] || 0) + 1;
  });
  return breakdown;
}

function getTopPlatforms(mentions: any[]): Array<{platform: string, count: number, reach: number, engagement: number}> {
  const platformData: Record<string, {count: number, reach: number, engagement: number}> = {};
  
  mentions.forEach(mention => {
    if (!platformData[mention.platform]) {
      platformData[mention.platform] = { count: 0, reach: 0, engagement: 0 };
    }
    platformData[mention.platform].count++;
    platformData[mention.platform].reach += mention.reach;
    platformData[mention.platform].engagement += mention.engagement;
  });
  
  return Object.entries(platformData)
    .map(([platform, data]) => ({ platform, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getSentimentTrend(mentions: any[]): Record<string, Record<string, number>> {
  const trend: Record<string, Record<string, number>> = {};
  
  mentions.forEach(mention => {
    const date = mention.timestamp.split('T')[0];
    if (!trend[date]) {
      trend[date] = { positive: 0, negative: 0, neutral: 0 };
    }
    trend[date][mention.sentiment]++;
  });
  
  return trend;
}
