import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Replace 'frontendpedia.com' with your actual domain
  const domain = 'frontendpedia.com';
  const ezoicAdsTxtUrl = `https://srv.adstxtmanager.com/19390/${domain}`;
  
  try {
    // Fetch the ads.txt content from Ezoic
    const response = await fetch(ezoicAdsTxtUrl);
    const adsTxtContent = await response.text();
    
    // Return the content with proper headers
    return new NextResponse(adsTxtContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching Ezoic ads.txt:', error);
    
    // Fallback content when Ezoic is unavailable
    const fallbackContent = `# Ads.txt temporarily unavailable. Please try again later.`;
    
    return new NextResponse(fallbackContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes on error
      },
    });
  }
}
