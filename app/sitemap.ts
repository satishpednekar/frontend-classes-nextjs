import { MetadataRoute } from "next";
import {
  getAllPostsSlugs,
  getAllCategories,
  getAllAuthorsSlugs
} from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";

  try {
    const [postEntries, categoryEntries, authorEntries] = await Promise.all([
      getAllPostsSlugs().catch(() => []),
      getAllCategories().catch(() => []),
      getAllAuthorsSlugs().catch(() => [])
    ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/archive`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 }
  ];

  const postRoutes: MetadataRoute.Sitemap = Array.isArray(postEntries)
    ? postEntries
        .filter((p: any) => p && p.slug)
        .map((p: any) => ({
          url: `${baseUrl}/post/${p.slug}`,
          lastModified: new Date(p.publishedAt || p._createdAt || now),
          changeFrequency: "weekly",
          priority: 0.8
        }))
    : [];

  const categoryRoutes: MetadataRoute.Sitemap = Array.isArray(categoryEntries)
    ? categoryEntries
        .filter((c: any) => c && c.category)
        .map((c: any) => ({
          url: `${baseUrl}/category/${c.category}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7
        }))
    : [];

  const authorRoutes: MetadataRoute.Sitemap = Array.isArray(authorEntries)
    ? authorEntries
        .filter((a: any) => a && a.author)
        .map((a: any) => ({
          url: `${baseUrl}/author/${a.author}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6
        }))
    : [];

    return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...authorRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if there's an error
    return [
      { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
      { url: `${baseUrl}/archive`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
      { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 }
    ];
  }
}

