import { getAllPosts } from '@/lib/sanity/client';

export async function GET() {
  const baseUrl = process.env.SITE_URL || 'https://www.frontendpedia.com';
  const posts = await getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Frontendpedia</title>
    <link>${baseUrl}</link>
    <description>Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/opengraph.jpg</url>
      <title>Frontendpedia</title>
      <link>${baseUrl}</link>
      <width>1200</width>
      <height>630</height>
    </image>
    ${posts
      .slice(0, 20)
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${baseUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post._createdAt).toUTCString()}</pubDate>
      <author>${post.author?.name || 'Frontendpedia'}</author>
      ${post.categories?.map(cat => `<category><![CDATA[${cat.title}]]></category>`).join('') || ''}
      ${post.mainImage ? `<enclosure url="${post.mainImage.asset?.url}" type="image/jpeg" />` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
