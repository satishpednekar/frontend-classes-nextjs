import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use a proper database
let shareCounts: Record<string, Record<string, number>> = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Get share counts for the specific URL
    const counts = shareCounts[url] || {
      twitter: 0,
      linkedin: 0,
      reddit: 0,
      email: 0,
      copy: 0
    };

    return NextResponse.json(counts);

  } catch (error) {
    console.error('Share counts retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve share counts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, platform, increment = 1 } = body;
    
    if (!url || !platform) {
      return NextResponse.json(
        { error: 'URL and platform are required' },
        { status: 400 }
      );
    }

    // Initialize counts for URL if not exists
    if (!shareCounts[url]) {
      shareCounts[url] = {
        twitter: 0,
        linkedin: 0,
        reddit: 0,
        email: 0,
        copy: 0
      };
    }

    // Increment the count for the platform
    shareCounts[url][platform] = (shareCounts[url][platform] || 0) + increment;

    return NextResponse.json({ 
      success: true, 
      counts: shareCounts[url] 
    });

  } catch (error) {
    console.error('Share count update error:', error);
    return NextResponse.json(
      { error: 'Failed to update share counts' },
      { status: 500 }
    );
  }
}
