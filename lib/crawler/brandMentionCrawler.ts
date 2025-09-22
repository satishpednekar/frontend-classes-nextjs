import { JSDOM } from 'jsdom';

interface CrawlResult {
  url: string;
  title: string;
  content: string;
  platform: string;
  author?: string;
  verified?: boolean;
  timestamp: string;
}

interface CrawlConfig {
  maxPages: number;
  delay: number; // ms between requests
  userAgent: string;
  timeout: number; // ms
}

export class BrandMentionCrawler {
  private config: CrawlConfig;
  private visitedUrls: Set<string> = new Set();
  private brandKeywords: string[] = [
    'frontendpedia',
    'frontend pedia',
    'frontend-pedia',
    'frontendpedia.com'
  ];

  constructor(config: Partial<CrawlConfig> = {}) {
    this.config = {
      maxPages: 50,
      delay: 1000,
      userAgent: 'Mozilla/5.0 (compatible; FrontendpediaBot/1.0; +https://frontendpedia.com/bot)',
      timeout: 10000,
      ...config
    };
  }

  async crawlForMentions(startUrls: string[]): Promise<CrawlResult[]> {
    const results: CrawlResult[] = [];
    const urlsToVisit = [...startUrls];
    
    console.log(`Starting crawl for brand mentions with ${startUrls.length} starting URLs`);

    while (urlsToVisit.length > 0 && results.length < this.config.maxPages) {
      const url = urlsToVisit.shift();
      
      if (!url || this.visitedUrls.has(url)) {
        continue;
      }

      try {
        console.log(`Crawling: ${url}`);
        const result = await this.crawlPage(url);
        
        if (result) {
          results.push(result);
          
          // Extract more URLs from the page content
          const newUrls = this.extractUrls(result.content, url);
          newUrls.forEach(newUrl => {
            if (!this.visitedUrls.has(newUrl) && this.isValidUrl(newUrl)) {
              urlsToVisit.push(newUrl);
            }
          });
        }

        this.visitedUrls.add(url);
        
        // Delay between requests to be respectful
        await this.delay(this.config.delay);
        
      } catch (error) {
        console.error(`Error crawling ${url}:`, error);
        this.visitedUrls.add(url);
      }
    }

    console.log(`Crawl completed. Found ${results.length} mentions.`);
    return results;
  }

  private async crawlPage(url: string): Promise<CrawlResult | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Extract page information
      const title = this.extractTitle(document);
      const content = this.extractContent(document);
      
      // Check if page contains brand mentions
      if (!this.containsBrandMention(content, title)) {
        return null;
      }

      // Determine platform
      const platform = this.determinePlatform(url);
      
      // Extract author if available
      const author = this.extractAuthor(document, platform);

      return {
        url,
        title,
        content,
        platform,
        author,
        verified: this.isVerifiedAuthor(author, platform),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Failed to crawl ${url}:`, error);
      return null;
    }
  }

  private extractTitle(document: Document): string {
    const titleElement = document.querySelector('title');
    return titleElement?.textContent?.trim() || '';
  }

  private extractContent(document: Document): string {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());

    // Extract text content from main content areas
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      'body'
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent?.trim() || '';
      }
    }

    return document.body?.textContent?.trim() || '';
  }

  private containsBrandMention(content: string, title: string): boolean {
    const searchText = `${title} ${content}`.toLowerCase();
    return this.brandKeywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
  }

  private determinePlatform(url: string): string {
    const domain = new URL(url).hostname.toLowerCase();
    
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
    if (domain.includes('linkedin.com')) return 'linkedin';
    if (domain.includes('reddit.com')) return 'reddit';
    if (domain.includes('medium.com')) return 'medium';
    if (domain.includes('dev.to')) return 'dev.to';
    if (domain.includes('hashnode.com')) return 'hashnode';
    if (domain.includes('github.com')) return 'github';
    if (domain.includes('youtube.com')) return 'youtube';
    if (domain.includes('discord.com') || domain.includes('discord.gg')) return 'discord';
    if (domain.includes('slack.com')) return 'slack';
    
    return 'website';
  }

  private extractAuthor(document: Document, platform: string): string | undefined {
    // Platform-specific author extraction
    switch (platform) {
      case 'twitter':
        return this.extractTwitterAuthor(document);
      case 'linkedin':
        return this.extractLinkedInAuthor(document);
      case 'reddit':
        return this.extractRedditAuthor(document);
      case 'medium':
        return this.extractMediumAuthor(document);
      default:
        return this.extractGenericAuthor(document);
    }
  }

  private extractTwitterAuthor(document: Document): string | undefined {
    const authorElement = document.querySelector('[data-testid="User-Name"] a') ||
                        document.querySelector('.css-1dbjc4n a[href^="/"]');
    return authorElement?.textContent?.trim();
  }

  private extractLinkedInAuthor(document: Document): string | undefined {
    const authorElement = document.querySelector('.feed-shared-actor__name') ||
                        document.querySelector('.update-components-actor__name');
    return authorElement?.textContent?.trim();
  }

  private extractRedditAuthor(document: Document): string | undefined {
    const authorElement = document.querySelector('.author') ||
                        document.querySelector('[data-testid="post_author_link"]');
    return authorElement?.textContent?.trim();
  }

  private extractMediumAuthor(document: Document): string | undefined {
    const authorElement = document.querySelector('.postMetaInline-authorLockup a') ||
                        document.querySelector('.authorName');
    return authorElement?.textContent?.trim();
  }

  private extractGenericAuthor(document: Document): string | undefined {
    const authorSelectors = [
      '[rel="author"]',
      '.author',
      '.byline',
      '.post-author',
      '.article-author',
      'meta[name="author"]'
    ];

    for (const selector of authorSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent?.trim() || 
               element.getAttribute('content')?.trim();
      }
    }

    return undefined;
  }

  private isVerifiedAuthor(author: string | undefined, platform: string): boolean {
    if (!author) return false;
    
    // Simple verification logic - in production, use platform APIs
    const verifiedKeywords = ['verified', 'official', 'staff', 'admin'];
    return verifiedKeywords.some(keyword => 
      author.toLowerCase().includes(keyword)
    );
  }

  private extractUrls(content: string, baseUrl: string): string[] {
    const urls: string[] = [];
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
    const matches = content.match(urlRegex);
    
    if (matches) {
      matches.forEach(url => {
        try {
          const absoluteUrl = new URL(url, baseUrl).href;
          urls.push(absoluteUrl);
        } catch (error) {
          // Invalid URL, skip
        }
      });
    }
    
    return [...new Set(urls)]; // Remove duplicates
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Utility function to start crawling
export async function startBrandMentionCrawl(startUrls: string[]): Promise<void> {
  const crawler = new BrandMentionCrawler({
    maxPages: 100,
    delay: 2000, // 2 seconds between requests
    timeout: 15000 // 15 seconds timeout
  });

  try {
    const results = await crawler.crawlForMentions(startUrls);
    
    // Save results to database
    for (const result of results) {
      await fetch('/api/analytics/brand-mentions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      });
    }
    
    console.log(`Successfully processed ${results.length} brand mentions`);
  } catch (error) {
    console.error('Brand mention crawl failed:', error);
  }
}
