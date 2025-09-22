import { NextRequest, NextResponse } from 'next/server';
import { startBrandMentionCrawl } from '@/lib/crawler/brandMentionCrawler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, maxPages = 50 } = body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Validate URLs
    const validUrls = urls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs provided' },
        { status: 400 }
      );
    }

    // Start crawling in background
    startBrandMentionCrawl(validUrls).catch(error => {
      console.error('Background crawl failed:', error);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Brand mention crawl started',
      urls: validUrls,
      maxPages
    });

  } catch (error) {
    console.error('Crawl trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to start brand mention crawl' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return crawl status and configuration
    return NextResponse.json({
      status: 'ready',
      message: 'Brand mention crawler is ready',
      supportedPlatforms: [
        'twitter',
        'linkedin', 
        'reddit',
        'medium',
        'dev.to',
        'hashnode',
        'github',
        'youtube',
        'discord',
        'slack',
        'website'
      ],
      defaultMaxPages: 50,
      defaultDelay: 2000
    });

  } catch (error) {
    console.error('Crawl status error:', error);
    return NextResponse.json(
      { error: 'Failed to get crawl status' },
      { status: 500 }
    );
  }
}
