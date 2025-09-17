import PostPage from "./default";
import Script from "next/script";
import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const title = post.title || "Post";
  const description = post.excerpt || undefined;
  const url = `${baseUrl}/post/${params.slug}`;
  const ogImage = post?.mainImage?.asset?._ref ? `/api/og?slug=${params.slug}` : "/opengraph.jpg";
  const publishedTime = post.publishedAt || post._createdAt || undefined;
  const authors = post?.author?.name ? [{ name: post.author.name }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      authors: authors?.map(a => a.name),
      publishedTime,
      images: [{ url: ogImage }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function PostDefault({ params }) {
  const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";
  const post = await getPostBySlug(params.slug);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Posts',
        item: `${baseUrl}/archive`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post?.title || params.slug,
        item: `${baseUrl}/post/${params.slug}`
      }
    ]
  };

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post?.title,
    description: post?.excerpt,
    author: post?.author?.name ? { '@type': 'Person', name: post.author.name } : undefined,
    datePublished: post?.publishedAt || post?._createdAt,
    dateModified: post?._updatedAt || post?.publishedAt || post?._createdAt,
    image: post?.mainImage ? `${baseUrl}/api/og?slug=${params.slug}` : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/post/${params.slug}`
    }
  };

  return (
    <>
      <Script id="ldjson-breadcrumb" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>
      <Script id="ldjson-blogposting" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(blogPosting)}
      </Script>
      <PostPage post={post} />
    </>
  );
}

// export const revalidate = 60;
