import { MetadataRoute } from "next";
import {
  getAllPostsSlugs,
  getAllCategories,
  getAllAuthorsSlugs
} from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";

  const [postEntries, categoryEntries, authorEntries] = await Promise.all([
    getAllPostsSlugs().catch(() => []),
    getAllCategories().catch(() => []),
    getAllAuthorsSlugs().catch(() => [])
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/archive`, lastModified: now, changeFrequency: "weekly", priority: 0.5 }
  ];

  const postRoutes: MetadataRoute.Sitemap = Array.isArray(postEntries)
    ? postEntries
        .filter((p: any) => p && p.slug)
        .map((p: any) => ({
          url: `${baseUrl}/post/${p.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7
        }))
    : [];

  const categoryRoutes: MetadataRoute.Sitemap = Array.isArray(categoryEntries)
    ? categoryEntries
        .filter((c: any) => c && c.category)
        .map((c: any) => ({
          url: `${baseUrl}/category/${c.category}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.5
        }))
    : [];

  const authorRoutes: MetadataRoute.Sitemap = Array.isArray(authorEntries)
    ? authorEntries
        .filter((a: any) => a && a.author)
        .map((a: any) => ({
          url: `${baseUrl}/author/${a.author}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.4
        }))
    : [];

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...authorRoutes];
}

